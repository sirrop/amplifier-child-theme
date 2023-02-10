import {useEffect, useLayoutEffect, useState} from "react";
import {PostModel} from "../models/post/PostModel";
import {GetPostsArgs, server} from "../server";
import {User} from "../models/users/User";
import {ListCommentsRequest} from "../rest/Comment";
import {CommentModel} from "../models/CommentModel";
import {ListPostsRequest} from "../rest/Post";
import {ListUsersRequest} from "../rest/UserResponse";

type RequestUpdateFunction = () => void

const AsyncHookStatus = {
    SUCCESS: "success",
    FAILURE: "failure",
    LOADING: "loading"
} as const

type AsyncHookStatus = typeof AsyncHookStatus[keyof typeof AsyncHookStatus]

class AsyncHookResult {
    constructor(
        public readonly status: AsyncHookStatus,
    ) {}

    get isLoading(): boolean {
        return this.status === AsyncHookStatus.LOADING
    }

    get isSuccess(): boolean {
        return this.status === AsyncHookStatus.SUCCESS
    }

    get isFailure(): boolean {
        return this.status === AsyncHookStatus.FAILURE
    }
}

class UseUsersResult extends AsyncHookResult {
    public constructor(
        status: AsyncHookStatus,
        public readonly users?: User[]
    ) {
        super(status);
    }
}

export function useUsers(req: ListUsersRequest): [UseUsersResult, RequestUpdateFunction] {
    const [result, setResult] = useState(new UseUsersResult(AsyncHookStatus.LOADING))

    const update = () => setResult(new UseUsersResult(AsyncHookStatus.LOADING))

    useEffect(() => {
        if (result.isLoading) {
            server.getUsers(req)
                .then(users => setResult(new UseUsersResult(AsyncHookStatus.SUCCESS, users)))
                .catch(err => {
                    console.error(err)
                    setResult(new UseUsersResult(AsyncHookStatus.FAILURE))
                })
        }
    })
    return [result, update]
}

class UseUserResult extends AsyncHookResult {
    public constructor(
        status: AsyncHookStatus,
        public readonly user?: User
    ) {
        super(status);
    }
}

export function useUser(id: number): UseUserResult {
    const [result, setResult] = useState(new UseUserResult(AsyncHookStatus.LOADING))

    useEffect(() => {
        if (result.isLoading) {
            server.getUser(id)
                .then(user => setResult(new UseUserResult(AsyncHookStatus.SUCCESS, user)))
                .catch(() => setResult(new UseUserResult(AsyncHookStatus.FAILURE)))
        }
    })

    return result
}

export function useCurrentUser(): [User, (User) => void, () => void] {
    const [user, setUser] = useState<User>(User.getGuest())
    const initialized = user !== User.getGuest()

    const login = (user: User) => {
        setUser(user)
    }

    const logout = () => {
        setUser(User.getGuest())
    }

    useEffect(() => {
        if (!initialized) {
            server.getCurrentUser()
                .then(setUser)
                .catch(console.error)
        }
    })

    return [user, login, logout]
}

export function useWindowSize(): number[] {
    const [size, setSize] = useState([0, 0])
    useLayoutEffect(() => {
        const updateSize = (): void => setSize([window.innerWidth, window.innerHeight])
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, [])
    return size
}

class UsePostsResult extends AsyncHookResult {
    constructor(
        status: AsyncHookStatus,
        public readonly posts: PostModel[]
    ) {
        super(status);
    }

    public with(option: {
        status?: AsyncHookStatus,
        posts?: PostModel[],
        update?: () => void
    }): UsePostsResult {
        return new UsePostsResult(
                option.status ?? this.status,
                option.posts ?? this.posts)
    }
}

export function usePosts(req: ListPostsRequest = {}): [UsePostsResult, () => void] {
    const [posts, setPosts] = useState(new UsePostsResult(AsyncHookStatus.LOADING, undefined))

    const update = () => setPosts(posts.with({ status: AsyncHookStatus.LOADING }))

    useEffect(() => {
        if (posts.isLoading) {
            server.getPosts(req)
                .then(it => setPosts(posts.with({
                    status: AsyncHookStatus.SUCCESS,
                    posts: it
                })))
                .catch(reason => {
                    console.error(reason)
                    setPosts(posts.with({ status: AsyncHookStatus.FAILURE }))
                })
        }
    })
    return [posts, update]
}

class UsePostResult extends AsyncHookResult {
    constructor(
        status: AsyncHookStatus,
        public readonly post?: PostModel
    ) {
        super(status);
    }

    public with(option: {
        status?: AsyncHookStatus,
        post?: PostModel
    }): UsePostResult {
        return new UsePostResult(option.status ?? this.status, option.post ?? this.post)
    }
}

export function usePost(id: number): [UsePostResult, () => void] {
    const [result, setResult] = useState(new UsePostResult(AsyncHookStatus.LOADING, undefined))
    const update = () => setResult(result.with({ status: AsyncHookStatus.LOADING }))

    useEffect(() => {
        if (result.isLoading) {
            server.getPost(id)
                .then(post => setResult(result.with({ status: AsyncHookStatus.SUCCESS, post: post })))
                .catch(() => setResult(result.with({status: AsyncHookStatus.FAILURE})))
        }
    })

    return [result, update]
}

class UseCommentsResult extends AsyncHookResult {
    public constructor(
        status: AsyncHookStatus,
        public readonly comments?: CommentModel[]
    ) {
        super(status);
    }

    public with(args: {
        status?: AsyncHookStatus,
        comments?: CommentModel[]
    }): UseCommentsResult {
        return new UseCommentsResult(
            args.status || this.status,
            args.comments || this.comments
        )
    }
}

export function useComments(req: ListCommentsRequest): [UseCommentsResult, () => void] {
    const [result, setResult] = useState(new UseCommentsResult(AsyncHookStatus.LOADING, undefined))
    const update = () => setResult(result.with({ status: AsyncHookStatus.LOADING }))

    useEffect(() => {
        if (result.isLoading) {
            server.getComments(req)
                .then(comments => setResult(result.with( { status: AsyncHookStatus.SUCCESS, comments: comments } )))
                .catch(() => setResult(result.with( { status: AsyncHookStatus.FAILURE } )))
        }
    })

    return [result, update]
}