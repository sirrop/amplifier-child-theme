import {User} from "../models/users/User";
import {Requests, RequestType} from "./Requests";

export const REQTYPE_LIST_USERS  = new RequestType('List Users')
export const REQTYPE_CREATE_USER = new RequestType<CreateUserRequest>('Create User')

export type ListUsersRequest = {
    page?: number
    per_page?: number
    search?: string
    exclude?: number[]
    include?: number[]
    offset?: number
    order?: 'asc'|'desc'
    orderby?: 'id'|'include'|'name'|'registered_date'|'slug'|'include_slugs'|'email'|'url'
    slug?: string[]
    roles?: string[]
}

export type CreateUserRequest = {
    username: string
    name?: string
    email: string
    description?: string
    slug: string
    roles: string
    password: string
}



export type UserResponse = {
    id: number
    name: string
    slug: string
    avatar_urls: any
    post_likes: number[]
    comment_likes: number[]
    post_shares: number[]
    comment_shares: number[]
    bookings: number[]
}

export function toUser(response: UserResponse): User {
    const {
        id,
        name,
        slug,
        avatar_urls,
        post_likes,
        comment_likes,
        post_shares,
        comment_shares,
        bookings
    } = response

    return User.of({
        id: id,
        name: name,
        slug: slug,
        icon: avatar_urls['96'],
        likes: {
            posts: post_likes ?? [],
            comments: comment_likes ?? []
        },
        shares: {
            posts: post_shares ?? [],
            comments: comment_shares ?? []
        },
        bookingList: bookings
    })
}

Requests.register(REQTYPE_LIST_USERS, req => {
    const record = Object.fromEntries(
        Object.entries(req)
            .map(([key, value]) => {
                const valueType = typeof value
                const val: string
                    = valueType === 'string' ? value as string
                    : valueType === 'number' ? value.toString()
                    : value instanceof Array<number> ? value.join(',')
                    : value instanceof Array<string> ? value.join(',')
                    : undefined
                if (val === undefined) throw new Error()
                return [key, val]
            })
    )
    return new URLSearchParams(record)
})
Requests.register(REQTYPE_CREATE_USER, (req) => new URLSearchParams(req))