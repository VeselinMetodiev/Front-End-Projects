import { IdType } from "./shared-types";

export class Answer {
    constructor(
        public text: string,
        public scorePercentage: string,
        public imageURI: string,
        public dateCreated: string,
        public dateModified: string,
        public id: IdType = undefined,
    ) {
        
    }
}