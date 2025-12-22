import Anthropic from "@anthropic-ai/sdk";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

// CLI arguments - only parsed when running as main script
const isMainScript = import.meta.url === `file://${process.argv[1]}`;
let DRY_RUN = false;
let USE_EMULATOR = false;
let LIMIT = Infinity;
let USER_FILTER: string | undefined;

if (isMainScript) {
  const args = process.argv.slice(2);
  DRY_RUN = args.includes("--dry-run");
  USE_EMULATOR = args.includes("--emulator");
  const limitIndex = args.indexOf("--limit");
  LIMIT = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : Infinity;
  const userIndex = args.indexOf("--user");
  USER_FILTER = userIndex !== -1 ? args[userIndex + 1] : undefined;

  if (DRY_RUN) {
    console.log("🔒 DRY RUN MODE - no changes will be written");
  }
  if (USE_EMULATOR) {
    console.log("🖥️  EMULATOR MODE - connecting to local Firestore");
  }
  if (LIMIT < Infinity) {
    console.log(`📊 Limited to ${LIMIT} recipes`);
  }
  if (USER_FILTER) {
    console.log(`👤 Filtering to user: ${USER_FILTER}`);
  }
  console.log();
}

// Types matching the app's schema - exported for testing
export interface Recipe {
  name?: string;
  description?: string;
  recipeIngredient?: string[];
  recipeInstructions?: { text: string }[] | string;
  recipeCategory?: string | string[];
}

interface RecipeDoc {
  data: Recipe;
  owners: string[];
  visibility: string;
  pendingEnrichment?: PendingEnrichment;
  lastEnrichedAt?: Timestamp;
  updated?: Timestamp;
}

export interface EnrichmentResult {
  description: string;
  suggestedTags: string[];
  reasoning: string;
}

interface PendingEnrichment {
  description: string;
  suggestedTags: string[];
  reasoning: string;
  generatedAt: Timestamp;
  model: string;
}

// Initialize Firebase Admin
function initFirebase() {
  if (USE_EMULATOR) {
    // Connect to local emulator
    process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
    initializeApp({ projectId: "recipe-box-335721" });
    console.log("Firebase initialized with emulator");
  } else {
    const serviceAccountPath = path.join(
      process.cwd(),
      "service-account-key.json"
    );

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, "utf8")
      ) as ServiceAccount;
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase initialized with service account");
    } else {
      // Try application default credentials
      initializeApp({
        projectId: "recipe-box-335721",
      });
      console.log(
        "Firebase initialized with application default credentials"
      );
    }
  }

  return getFirestore();
}

// Initialize Anthropic client
function initAnthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Error: ANTHROPIC_API_KEY environment variable not set");
    console.error("Set it with: export ANTHROPIC_API_KEY=your-key-here");
    process.exit(1);
  }
  return new Anthropic({ apiKey });
}

// Format recipe for Claude - exported for testing
export function formatRecipeForPrompt(recipe: Recipe): string {
  const parts: string[] = [];

  if (recipe.name) {
    parts.push(`Name: ${recipe.name}`);
  }

  if (recipe.recipeIngredient?.length) {
    parts.push(`\nIngredients:\n${recipe.recipeIngredient.join("\n")}`);
  }

  if (recipe.recipeInstructions) {
    let instructions: string;
    if (typeof recipe.recipeInstructions === "string") {
      instructions = recipe.recipeInstructions;
    } else if (Array.isArray(recipe.recipeInstructions)) {
      instructions = recipe.recipeInstructions
        .map((i, idx) => `${idx + 1}. ${i.text}`)
        .join("\n");
    } else {
      instructions = "";
    }
    if (instructions) {
      parts.push(`\nInstructions:\n${instructions}`);
    }
  }

  const currentTags = Array.isArray(recipe.recipeCategory)
    ? recipe.recipeCategory
    : recipe.recipeCategory
      ? [recipe.recipeCategory]
      : [];

  if (currentTags.length > 0) {
    parts.push(`\nCurrent tags: ${currentTags.join(", ")}`);
  }

  return parts.join("\n");
}

// Call Claude to enrich the recipe
async function enrichRecipe(
  client: Anthropic,
  recipe: Recipe
): Promise<EnrichmentResult> {
  const recipeText = formatRecipeForPrompt(recipe);
  const needsDescription = !recipe.description?.trim();

  const prompt = `Analyze this recipe and provide:
1. ${needsDescription ? "A brief, appetizing description (1-2 sentences)" : "The existing description is fine, just return it"}
2. Suggested tags/categories for organization (e.g., "dinner", "vegetarian", "quick", "comfort food", "italian", etc.)
3. Brief reasoning for your tag suggestions

Recipe:
${recipeText}

Respond in this exact JSON format:
{
  "description": "your description here",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "reasoning": "brief explanation of tag choices"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  return parseEnrichmentResponse(content.text);
}

// Parse Claude's response - exported for testing
export function parseEnrichmentResponse(text: string): EnrichmentResult {
  // Extract JSON from response (handle markdown code blocks)
  let jsonStr = text;
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  try {
    return JSON.parse(jsonStr.trim()) as EnrichmentResult;
  } catch {
    throw new Error(`Failed to parse response as JSON: ${text.substring(0, 100)}...`);
  }
}

// Resolve user filter to UID (handles both email and UID input)
async function resolveUserFilter(userFilter: string): Promise<string> {
  // If it looks like an email, look up the UID
  if (userFilter.includes("@")) {
    const auth = getAuth();
    try {
      const userRecord = await auth.getUserByEmail(userFilter);
      console.log(`Resolved ${userFilter} to UID: ${userRecord.uid}\n`);
      return userRecord.uid;
    } catch {
      throw new Error(`Could not find user with email: ${userFilter}`);
    }
  }
  // Otherwise assume it's already a UID
  return userFilter;
}

// Main function
async function main() {
  console.log("Recipe Enrichment Script");
  console.log("========================");
  console.log("This script ONLY adds a 'pendingEnrichment' field.");
  console.log("It never modifies existing recipe data.\n");

  const db = initFirebase();
  const anthropic = initAnthropic();

  // Resolve user filter if provided
  let userUid: string | undefined;
  if (USER_FILTER) {
    userUid = await resolveUserFilter(USER_FILTER);
  }

  // Get all boxes
  const boxesSnapshot = await db.collection("boxes").get();
  console.log(`Found ${boxesSnapshot.size} boxes\n`);

  let totalRecipes = 0;
  let enrichedCount = 0;
  let skippedCount = 0;
  let processedCount = 0;

  for (const boxDoc of boxesSnapshot.docs) {
    if (processedCount >= LIMIT) break;

    const boxData = boxDoc.data();

    // Skip boxes not owned by the filtered user
    if (userUid && !boxData.owners?.includes(userUid)) {
      continue;
    }

    console.log(`\n📦 Box: ${boxData.data?.name || boxDoc.id}`);

    const recipesSnapshot = await db
      .collection("boxes")
      .doc(boxDoc.id)
      .collection("recipes")
      .get();

    for (const recipeDoc of recipesSnapshot.docs) {
      if (processedCount >= LIMIT) break;

      const recipeData = recipeDoc.data() as RecipeDoc;

      // Skip recipes not owned by the filtered user
      if (userUid && !recipeData.owners?.includes(userUid)) {
        continue;
      }

      totalRecipes++;
      const recipe = recipeData.data;
      const recipeName = recipe.name || "Unnamed Recipe";

      console.log(`\n  📝 ${recipeName}`);

      // Skip if already has pending enrichment
      if (recipeData.pendingEnrichment) {
        console.log("     ⏭️  Already has pending enrichment, skipping");
        skippedCount++;
        continue;
      }

      // Skip if already enriched and no user updates since
      if (recipeData.lastEnrichedAt && recipeData.updated) {
        if (recipeData.lastEnrichedAt.toMillis() >= recipeData.updated.toMillis()) {
          console.log("     ⏭️  No changes since last enrichment, skipping");
          skippedCount++;
          continue;
        }
        console.log("     🔄 Recipe updated since last enrichment, re-processing");
      }

      const needsDescription = !recipe.description?.trim();
      const currentTags = Array.isArray(recipe.recipeCategory)
        ? recipe.recipeCategory
        : recipe.recipeCategory
          ? [recipe.recipeCategory]
          : [];

      console.log(`     Description: ${needsDescription ? "❌ Missing" : "✓ Present"}`);
      console.log(`     Current tags: ${currentTags.length > 0 ? currentTags.join(", ") : "none"}`);

      try {
        console.log("     🤖 Analyzing with Claude...");
        const enrichment = await enrichRecipe(anthropic, recipe);

        console.log("\n     Suggestions:");
        console.log(`     📄 Description: "${enrichment.description}"`);
        console.log(`     🏷️  Tags: ${enrichment.suggestedTags.join(", ")}`);
        console.log(`     💭 Reasoning: ${enrichment.reasoning}`);

        // Create pending enrichment object
        const pendingEnrichment: PendingEnrichment = {
          description: enrichment.description,
          suggestedTags: enrichment.suggestedTags,
          reasoning: enrichment.reasoning,
          generatedAt: Timestamp.now(),
          model: "claude-sonnet-4-20250514",
        };

        if (DRY_RUN) {
          console.log("     🔒 Would write pendingEnrichment (dry run)");
        } else {
          // Set pendingEnrichment and lastEnrichedAt - never touch other fields
          await db
            .collection("boxes")
            .doc(boxDoc.id)
            .collection("recipes")
            .doc(recipeDoc.id)
            .set({ pendingEnrichment, lastEnrichedAt: Timestamp.now() }, { merge: true });
          console.log("     ✅ Added pendingEnrichment");
        }
        enrichedCount++;
        processedCount++;
      } catch (error) {
        console.error(`     ❌ Error: ${error}`);
        skippedCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  console.log("\n========================");
  console.log(`Total recipes seen: ${totalRecipes}`);
  console.log(`Enriched: ${enrichedCount}${DRY_RUN ? " (dry run)" : ""}`);
  console.log(`Skipped: ${skippedCount}`);
}

// Only run main when executed directly
if (isMainScript) {
  main().catch(console.error);
}
