import { Tag } from "antd";
import { doc, DocumentSnapshot, SnapshotOptions, Timestamp } from "firebase/firestore";
import _ from "lodash";
import { Recipe } from "schema-dts";
import { db } from "./backend";
import { BoxType, BoxStoreType, RecipeStoreType, Visibility, UserStoreType, BoxId, UserId } from "./types";
import { decodeStr } from "./utils";

const DUMMY_FIRST_DATE = new Date(2022, 0, 0)
const DUMMY_FIRST_TIMESTAMP = Timestamp.fromDate(DUMMY_FIRST_DATE)
export class RecipeEntry {
    id: string;
    data: Recipe;
    changed?: Recipe;
    owners: string[];
    editing: boolean;
    creator: UserId;
    visibility: Visibility;
    created: Date;
    updated: Date;
    lastUpdatedBy: string;

    constructor(
        data: Recipe,
        owners: string[],
        visibility: Visibility,
        creator: UserId,
        id: string,
        created: Date,
        updated: Date,
        lastUpdatedBy: string
    ) {
        this.data = data;
        this.id = id;
        this.creator = creator
        this.owners = owners;
        this.visibility = visibility;
        this.created = created || DUMMY_FIRST_DATE;
        this.updated = updated || DUMMY_FIRST_DATE;
        this.lastUpdatedBy = lastUpdatedBy || this.creator;

        this.editing = false;
    }

    clone() {
        const newRecipe = new RecipeEntry(
            _.cloneDeep(this.data),
            this.owners,
            this.visibility,
            this.creator,
            this.id,
            this.created,
            this.updated,
            this.lastUpdatedBy
        )
        newRecipe.editing = this.editing
        return newRecipe
    }
    toString() {
        return `Recipe: ${this.data.name}`;
    }

    getData() {
        return this.changed ? this.changed : this.data
    }

    getUserMsg(user: UserEntry) {
        if (this.created > user.lastSeen) {
            return <Tag color={"red"}>New</Tag>
        } else if (this.updated > user.lastSeen) {
            return <Tag color={"orange"}>Updated</Tag>
        } else {
            return <div />
        }
    }

    getName() {
        return decodeStr(this.getData().name as string)
    }
    getDescription() {
        return decodeStr(this.getData().description as string)
    }

}

export const recipeConverter = {
    toFirestore: (recipe: RecipeEntry): RecipeStoreType => {
        return {
            data: recipe.data,
            owners: recipe.owners,
            visibility: recipe.visibility,
            updated: Timestamp.fromDate(recipe.updated),
            created: Timestamp.fromDate(recipe.created),
            lastUpdatedBy: recipe.lastUpdatedBy,
            creator: recipe.creator ? recipe.creator : recipe.owners[0],
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const rawRecipe = snapshot.data(options) as RecipeStoreType
        return new RecipeEntry(
            rawRecipe.data,
            rawRecipe.owners,
            rawRecipe.visibility,
            rawRecipe.creator,
            snapshot.id,
            (rawRecipe.created || DUMMY_FIRST_TIMESTAMP).toDate(),
            (rawRecipe.updated || DUMMY_FIRST_TIMESTAMP).toDate(),
            rawRecipe.lastUpdatedBy,
        );
    }
};


export class BoxEntry {
    data: BoxType;
    changed?: BoxType;
    id: string;
    owners: string[];
    creator: string;
    visibility: Visibility;
    recipes: Map<string, RecipeEntry>
    created: Date;
    updated: Date;
    lastUpdatedBy: string;

    constructor(
        data: BoxType,
        owners: string[],
        visibility: Visibility,
        creator: UserId,
        id: string,
        created: Date,
        updated: Date,
        lastUpdatedBy: string
    ) {
        this.data = data;
        this.id = id;
        this.owners = owners;
        this.visibility = visibility;
        this.creator = creator
        this.created = created || DUMMY_FIRST_DATE;
        this.updated = updated || DUMMY_FIRST_DATE;
        this.lastUpdatedBy = lastUpdatedBy || this.creator;

        this.recipes = new Map<string, RecipeEntry>()
    }
    toString() {
        return `Box: ${this.id} = ${this.data.name}`;
    }

    clone() {
        const newBox = new BoxEntry(
            _.cloneDeep(this.data),
            [...this.owners],
            this.visibility,
            this.creator,
            this.id,
            this.created,
            this.updated,
            this.lastUpdatedBy,
        )

        newBox.recipes = _.cloneDeep(this.recipes)
        return newBox
    }

    getName() {
        return decodeStr(this.data.name)
    }
}

export const boxConverter = {
    toFirestore: (box: BoxEntry): BoxStoreType => {
        return {
            data: box.data,
            owners: box.owners,
            visibility: box.visibility,
            updated: Timestamp.fromDate(box.updated),
            created: Timestamp.fromDate(box.created),
            lastUpdatedBy: box.lastUpdatedBy,
            creator: box.creator ? box.creator : box.owners[0],
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options) as BoxStoreType
        return new BoxEntry(
            data.data,
            data.owners,
            data.visibility,
            data.creator,
            snapshot.id,
            (data.created || DUMMY_FIRST_TIMESTAMP).toDate(),
            (data.updated || DUMMY_FIRST_TIMESTAMP).toDate(),
            data.lastUpdatedBy
        );
    }
};

export class UserEntry {
    name: string
    visibility: Visibility
    boxes: BoxId[]
    lastSeen: Date
    newSeen: Date
    id: string

    constructor(name: string, visibility: Visibility, boxes: BoxId[], lastSeen: Date, newSeen: Date, id: string) {
        this.name = name
        this.visibility = visibility
        this.boxes = boxes
        this.lastSeen = lastSeen
        this.newSeen = newSeen
        this.id = id
    }
}


export const userConverter = {
    toFirestore: (user: UserEntry) => {
        return {
            name: user.name,
            visibility: user.visibility,
            lastSeen: user.lastSeen,
            newSeen: user.newSeen,
            boxes: user.boxes.map(bid => doc(db, "boxes", bid)),
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options) as UserStoreType
        const boxIds = data.boxes.map(b => b.id)
        return new UserEntry(
            data.name,
            data.visibility,
            boxIds,
            (data.lastSeen  || DUMMY_FIRST_TIMESTAMP).toDate(),
            (data.newSeen  || DUMMY_FIRST_TIMESTAMP).toDate(),
            snapshot.id
        )
    }
};