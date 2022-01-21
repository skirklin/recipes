import { doc, DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { Recipe } from "schema-dts";
import { db } from "./backend";
import { BoxType, BoxStoreType, RecipeStoreType, Visibility, UserStoreType, BoxId, UserId } from "./types";

export class RecipeEntry {
    id: string | undefined;
    data: Recipe;
    changed?: Recipe;
    owners: string[];
    creator: UserId;
    visibility: Visibility;

    constructor(data: Recipe, owners: string[], visibility: Visibility, creator: UserId, id?: string) {
        this.data = data;
        this.id = id;
        this.creator = creator
        this.owners = owners;
        this.visibility = visibility;
    }
    toString() {
        return `Recipe: ${this.data.name}`;
    }

}

export const recipeConverter = {
    toFirestore: (recipe: RecipeEntry): RecipeStoreType => {
        return {
            data: recipe.data,
            owners: recipe.owners,
            visibility: recipe.visibility,
            creator: recipe.creator ? recipe.creator : recipe.owners[0],
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const rawRecipe = snapshot.data(options) as RecipeStoreType
        return new RecipeEntry(rawRecipe.data, rawRecipe.owners, rawRecipe.visibility, snapshot.id);
    }
};


export class BoxEntry {
    data: BoxType;
    changed?: BoxType;
    id: string | undefined;
    owners: string[];
    creator: string;
    visibility: Visibility;
    recipes: Map<string, RecipeEntry>

    constructor(data: BoxType, owners: string[], visibility: Visibility, creator: UserId, id?: string) {
        this.data = data;
        this.id = id;
        this.owners = owners;
        this.visibility = visibility;
        this.creator = creator
        this.recipes = new Map<string, RecipeEntry>()
    }
    toString() {
        return `Box: ${this.id} = ${this.data.name}`;
    }
}

export const boxConverter = {
    toFirestore: (box: BoxEntry): BoxStoreType => {
        return {
            data: box.data,
            owners: box.owners,
            visibility: box.visibility,
            creator: box.creator ? box.creator : box.owners[0],
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options) as BoxStoreType
        return new BoxEntry(data.data, data.owners, data.visibility, data.creator, snapshot.id);
    }
};

export class UserEntry {
    name: string
    visibility: Visibility
    boxes: BoxId[]
    id: string

    constructor(name: string, visibility: Visibility, boxes: BoxId[], id: string) {
        this.name = name
        this.visibility = visibility
        this.boxes = boxes
        this.id = id
    }
}


export const userConverter = {
    toFirestore: (user: UserEntry) => {
        return {
            name: user.name,
            visibility: user.visibility,
            boxes: user.boxes.map(bid => doc(db, "boxes", bid)),
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options) as UserStoreType
        const boxIds = data.boxes.map(b => b.id)
        return new UserEntry(data.name, data.visibility, boxIds, snapshot.id)
    }
};