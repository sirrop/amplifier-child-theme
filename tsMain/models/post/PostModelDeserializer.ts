import {PostModel} from "./PostModel";

export class PostModelDeserializer {
    public static fromJSON(json: any): PostModel|null {
        const {
            slug, content, comments, author, likes, shares
        } = json
        if (slug && content && comments && author && likes && shares) {

        }
        return null
    }
}