import {CommentModel} from "../models/CommentModel";
import {Requests, RequestType} from "./Requests";
import {PublicationType} from "../models/Publication";
import {User} from "../models/users/User";
import {OrderType} from "./types";

export const REQTYPE_LIST_COMMENTS = new RequestType<ListCommentsRequest>('list_comments')
export const REQTYPE_CREATE_COMMENT = new RequestType<CreateCommentRequest>('create_comment')
export const REQTYPE_UPDATE_COMMENT = new RequestType<UpdateCommentRequest>('update_comment')
export const REQTYPE_DELETE_COMMENT = new RequestType<DeleteCommentRequest>('delete_comment')

export type ListCommentsRequest = {
    page?: number
    per_page?: number
    search?: string
    after?: Date
    author?: number[]
    author_exclude?: number[]
    before?: Date
    exclude?: number[]
    include?: number[]
    offset?: number
    order?: OrderType
    orderby?: 'date'|'id'|'post'|'parent'|'type'
    parent?: number
    parent_exclude?: number
    post?: number
}

export type CreateCommentRequest = {
    author: number
    content: string
    date: Date
    parent: number
    post: number
}

export type UpdateCommentRequest = {
    id: number
    content: string
}

export type DeleteCommentRequest = {
    id: number
} | number

export type CommentResponse = {
    id: number
    author_data: User
    content: {
        rendered: string
    }
    date: string
    parent: number
    post: number
}

export function responseToCommentModel(response: CommentResponse): CommentModel {
    const {
        id,
        author_data,
        content,
        date,
        parent,
        post
    } = response

    return {
        id: id,
        author: author_data,
        type: PublicationType.COMMENT,
        content: content.rendered,
        date: new Date(date),
        likedBy: [],
        sharedBy: [],
        photos: [],
        parent: parent,
        post: post
    }
}

Requests.register(REQTYPE_LIST_COMMENTS, (req) => {
    const record: Record<string, string|null> = Object.fromEntries(
        Object.entries(req)
            .map(([key, value]) => {
                const valueType = typeof value
                const val: string
                    = valueType === 'string' ? value as string
                    : valueType === 'number' ? value.toString()
                    : value instanceof Array<number> ? value.join(',')
                    : value instanceof Date ? value.toISOString()
                    : undefined
                if (val === undefined) throw new Error()
                return [key, val]
            })
    )
    return new URLSearchParams(record)
})

Requests.register(REQTYPE_CREATE_COMMENT, (req) => {
    const record: Record<string, string> = Object.fromEntries(
        Object.entries(req)
            .map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value.toString()])
    )
    return new URLSearchParams(record)
})

Requests.register(REQTYPE_UPDATE_COMMENT, (req) => {
    const record: Record<string, string> = Object.fromEntries(
        Object.entries(req)
            .map(([key, value]) => [key, value.toString()])
    )
    return new URLSearchParams(record)
})