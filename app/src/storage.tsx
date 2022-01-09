import { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { Recipe } from "schema-dts";
import { BoxDataType, BoxStoreType, RecipeStoreType, Visibility } from "./types";

export class RecipeEntry {
    id: string | undefined;
    data: Recipe;
    changed?: Recipe;
    owners: string[];
    visibility: Visibility;

    constructor(data: Recipe, owners: string[], visibility: Visibility, id?: string) {
        this.data = data;
        this.id = id;
        this.owners = owners;
        this.visibility = visibility;
    }
    toString() {
        return this.id;
    }
}

export const recipeConverter = {
    toFirestore: (recipe: RecipeEntry) => {
        return {
            data: recipe.data,
            owners: recipe.owners,
            visibility: recipe.visibility,
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const rawRecipe = snapshot.data(options) as RecipeStoreType
        return new RecipeEntry(rawRecipe.data, rawRecipe.owners, rawRecipe.visibility, snapshot.id);
    }
};


export class BoxEntry {
    data: BoxDataType;
    id: string | undefined;
    owners: string[];
    visibility: Visibility;
    recipes: Map<string, RecipeEntry>

    constructor(data: BoxDataType, owners: string[], visibility: Visibility, id?: string) {
        this.data = data;
        this.id = id;
        this.owners = owners;
        this.visibility = visibility;
        this.recipes = new Map<string, RecipeEntry>()
    }
    toString() {
        return `Box: ${this.id} = ${this.data.name}`;
    }
}

export const boxConverter = {
    toFirestore: (box: BoxEntry) => {
        return {
            data: box.data,
            owners: box.owners,
            visibility: box.visibility,
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options) as BoxStoreType
        return new BoxEntry(data.data, data.owners, data.visibility, snapshot.id);
    }
};
