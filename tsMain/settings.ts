export const settings = {
    debug: true,
    format: {
        datetime: 'yyyy-LL-dd HH:mm',
        date: 'yyyy-LL-dd',
        time: 'HH:mm'
    }
} as const

type WpApiSettings = {
    readonly nonce: string
}

export function getWpApiSettings(): WpApiSettings {
    // @ts-ignore
    return WP_API_SETTINGS
}