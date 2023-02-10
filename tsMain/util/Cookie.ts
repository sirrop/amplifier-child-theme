import Cookies from "js-cookie"

interface Cookie {
    set(key: string, value: string)
    get(key: string): string|null
    remove(key: string): string
}

export const cookie = {
    set: (key, value) => Cookies.set(key, value),
    get: (key) => Cookies.get(key) ?? null,
    remove: (key) => Cookies.remove(key)
} as Cookie

export const CookieKey = {
    USER_ID: 'com.uoeh-amplifier.user.id'
} as const

export type CookieKey = typeof CookieKey[keyof typeof CookieKey]