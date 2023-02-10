import {To} from "react-router-dom";
import {Post} from "../components/post/Post";

export const RoutePaths = {
    AMPLIFIER: "/",
    TOP: pathOf("/"),
    LOGIN: pathOf('/login/'),
    LOGOUT: pathOf('/logout/'),
    SIGNUP: pathOf('/signup/'),
    PROFILE: pathOf(`/user/:slug`),
    USER_SETTINGS: pathOf('/user/:slug/settings'),
    EXPLORE: pathOf("/explore/"),
    POST: pathOf('/post/:id'),
    DEBUG: pathOf("/debug/"),
    ACCESS_INHIBITED: pathOf('/inhibited/')
} as const

function pathOf(subPath: string): string {
    return `/community${subPath}`
}

export type RoutePaths = typeof RoutePaths[keyof typeof RoutePaths]

export function userPathOf(args: { slug: string, to: RoutePaths }): To {
    return args.to.replace(':slug', args.slug)
}

export function postPathOf(args: { id: string }): To {
    return RoutePaths.POST.replace(':id', args.id)
}