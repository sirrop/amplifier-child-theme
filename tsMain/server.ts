import {User} from "./models/users/User";
import {PostModel} from "./models/post/PostModel";
import {getWpApiSettings} from "./settings";
import {EventData} from "./models/post/EventData";
import {
    CreateUserRequest,
    ListUsersRequest,
    REQTYPE_CREATE_USER,
    REQTYPE_LIST_USERS,
    toUser
} from "./rest/UserResponse";
import {ListPostsRequest, REQTYPE_LIST_POSTS, toPost} from "./rest/Post";
import {
    CreateCommentRequest,
    DeleteCommentRequest,
    ListCommentsRequest, REQTYPE_CREATE_COMMENT, REQTYPE_LIST_COMMENTS, REQTYPE_UPDATE_COMMENT,
    responseToCommentModel,
    UpdateCommentRequest
} from "./rest/Comment";
import {CommentModel} from "./models/CommentModel";
import {Requests} from "./rest/Requests";

/* Public APIs */
export type AddPostArgs = {
    date: Date,
    slug: string,
    content: string,
    author: User,
    photos: string[],
    eventData: EventData
}

export type GetPostsArgs = {
    author?: number
}

type PostStatus = 'publish' | 'draft'

export interface Server {
    readonly url: string

    auth(email: string, password: string): Promise<User|null>

    getUsers(req?: ListUsersRequest): Promise<User[]>
    getUser(id: number): Promise<User|null>
    getCurrentUser(): Promise<User>
    updateUser(user: User): Promise<Response>
    createUser(req: CreateUserRequest): Promise<Response>

    getPost(id: number): Promise<PostModel>
    getPosts(req?: ListPostsRequest): Promise<PostModel[]>
    addPost(post: AddPostArgs, status: PostStatus): Promise<Response>
    updatePost(post: PostModel): Promise<Response>
    deletePost(id: number): Promise<Response>

    getComments(req: ListCommentsRequest): Promise<CommentModel[]>
    addComment(req: CreateCommentRequest): Promise<Response>
    updateComment(req: UpdateCommentRequest): Promise<Response>
    deleteComment(req: DeleteCommentRequest): Promise<Response>


    bookEvent(event: number, user: string): Promise<Response>
    cancelEvent(event: number, user: string): Promise<Response>
}

/* Private APIs */

const BaseRoots = {
    posts: "wp/v2/posts",
    users: "wp/v2/users",
    asmoPost: "asmo/v1/posts",
    bookEvent: "asmo/v1/book_event",
    cancelEvent: "asmo/v1/cancel_event",
    auth: "asmo/v1/auth",
    me: 'asmo/v1/current_user',
    comments: 'wp/v2/comments'
} as const

function handle(response: Response): Response {
    if (response.ok) return response
    throw new Error(response.statusText)
}

class ServerImpl implements Server {
    public readonly conjunction: string

    public constructor(
        public readonly url: string
    ) {
        if (url.endsWith("/")) {
            this.conjunction = "wp-json/"
        } else {
            this.conjunction = "/wp-json/"
        }
    }

    private get(endpoint: string, params: URLSearchParams|null = null, needNonce: boolean = false): Promise<Response> {
        const ques = params ? '?' : null

        const headers = new Headers()
        if (needNonce) headers.append('X-WP-Nonce', getWpApiSettings().nonce)

        return fetch(this.endpointOf(endpoint) + (ques ? ques + params : ''), {
            method: 'get',
            headers: headers
        }).then(handle)
    }

    private post(endpoint: string, body: BodyInit): Promise<Response> {
        const headers = new Headers()
        headers.append('X-WP-Nonce', getWpApiSettings().nonce)
        return fetch(this.endpointOf(endpoint), {
            method: 'post',
            headers: headers,
            body: body
        }).then(handle)
    }

    private endpointOf(path: string): string {
        return this.url + this.conjunction + path
    }

    public async auth(email: string, password: string): Promise<User|null> {
        const url = `${this.url}${this.conjunction}${BaseRoots.auth}`

        const params = new URLSearchParams()
        params.append('email', email)
        params.append('password', password)

        const options = {
            method: 'post',
            body: params
        }

        return fetch(url, options)
            .then(res => res.json())
            .then(res => {
                if (res.status === 'failure') {
                    return null
                } else {
                    return res.user as User
                }
            })
    }

    public async getUsers(req: ListUsersRequest): Promise<User[]> {
        return this.get(BaseRoots.users, Requests.requestToParams(REQTYPE_LIST_USERS, req || {}), true)
            .then(res => res.json())
            .then(json => json.map(toUser))
    }

    public async getUser(userId: number): Promise<User|null> {
        if (userId === 0) {
            return User.getGuest()
        }

        return this.get(BaseRoots.users + '/' + userId, null, true)
            .then(res => res.json())
            .then(toUser)
    }

    public async getCurrentUser(): Promise<User> {
        const url = this.endpointOf(BaseRoots.me)
        const headers = new Headers()
        headers.append('X-WP-Nonce', getWpApiSettings().nonce)
        const options = {
            headers: headers,
            method: 'get'
        }
        return fetch(url, options)
            .then(res => res.json())
            .then(toUser)
    }

    public async updateUser(user: User): Promise<Response> {
        if (user === User.getGuest()) return

        return this.post(BaseRoots.users + '/' + user.id, new URLSearchParams({
            id: user.id.toString(),
            name: user.name,
            post_likes: user.likes.posts.join(','),
            comment_likes: user.likes.comments.join(','),
            post_shares: user.shares.posts.join(','),
            comment_shares: user.shares.comments.join(','),
            follows: user.follows.join(','),
            followers: user.followers.join(',')
        }))
    }

    public async createUser(req: CreateUserRequest): Promise<Response> {
        return this.post(BaseRoots.users, Requests.requestToParams(REQTYPE_CREATE_USER, req))
    }

    public async getPost(id: number): Promise<PostModel> {
        return this.get('wp/v2/asmo_post/' + id)
            .then(res => res.json())
            .then(toPost)
    }

    public async getPosts(req: ListPostsRequest = {}): Promise<PostModel[]> {
        return this.get('wp/v2/asmo_post', Requests.requestToParams(REQTYPE_LIST_POSTS, req || {}))
                .then((res) =>  res.json())
                .then(res => res.map(toPost))
    }

    public async addPost(post: AddPostArgs, status: PostStatus): Promise<Response> {
        const { date, slug, content, author, photos } = post

        return this.post('wp/v2/asmo_post', new URLSearchParams({
            date: date.toISOString(),
            slug: slug,
            status: status,
            content: content,
            comment_status: 'open',
            author: author.id.toString(),
            photos: photos.join(','),
            event_data: JSON.stringify(post.eventData)
        }))
    }

    public async updatePost(post: PostModel): Promise<Response> {
        return this.post('wp/v2/asmo_post/' + post.id, new URLSearchParams({
            content: post.content,
            likes: post.likedBy.join(','),
            shares: post.likedBy.join(','),
            photos: post.photos.join(','),
            event_data: JSON.stringify(post.eventData)
        }))
    }

    public async deletePost(id: number): Promise<Response> {
        const url = this.endpointOf('wp/v2/asmo_post/' + id)

        const headers = new Headers()
        headers.append('X-WP-Nonce', getWpApiSettings().nonce)

        return fetch(url, {
            method: 'delete',
            headers: headers
        }).then(handle)
    }

    public async bookEvent(event: number, user: string): Promise<Response> {
        return this.post(BaseRoots.bookEvent, new URLSearchParams({
            event: event.toString(),
            user: user
        }))
    }

    public async cancelEvent(event: number, user: string): Promise<Response> {
        return this.post(BaseRoots.cancelEvent, new URLSearchParams({
            event: event.toString(),
            user: user
        }))
    }

    addComment(req: CreateCommentRequest): Promise<Response> {
        return this.post(BaseRoots.comments, Requests.requestToParams(REQTYPE_CREATE_COMMENT, req))
    }

    getComments(req: ListCommentsRequest): Promise<CommentModel[]> {
        return this.get(BaseRoots.comments, Requests.requestToParams(REQTYPE_LIST_COMMENTS, req))
            .then(res => res.json())
            .then(res => res.map(responseToCommentModel))
    }

    updateComment(req: UpdateCommentRequest): Promise<Response> {
        return this.post(BaseRoots.comments + '/' + req.id, Requests.requestToParams(REQTYPE_UPDATE_COMMENT, req))
    }

    deleteComment(req: DeleteCommentRequest): Promise<Response> {
        const id = typeof req === 'object' ? req.id : req
        const url = this.endpointOf(BaseRoots.comments + '/' + id)

        const headers = new Headers()
        headers.append('X-WP-Nonce', getWpApiSettings().nonce)

        return fetch(url, {
            'method': 'delete',
            headers: headers
        })
    }
}

export const server: Server = new ServerImpl(window.location.origin)