export function encodeId(id: number): string {
    return encodeURI(window.btoa('' + id))
}

export function decodeId(id: string): number {
    return parseInt(window.atob(decodeURI(id)))
}

export function validateId(id: number, allowZero: boolean = true): [number, Error|null] {
    if (id < 0) return [id, new Error('id < 0')]
    if (!allowZero && id === 0) return [id, new Error('!allowZero && id === 0')]
    if (!Number.isInteger(id)) return [id, new Error('"id" is not an integer')]
    return [id, null]
}