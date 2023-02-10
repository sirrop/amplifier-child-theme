import {PostModel} from "../../models/post/PostModel";
import {User} from "../../models/users/User";

export interface PostState {
    readonly post: PostModel,
    readonly readingUser: User
}