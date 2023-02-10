const DEFAULT_COMPARATOR = (val1, val2) => val1 === val2

export function equals<T>(arr1: T[], arr2: T[], comparator: (val1: T, val2: T) => boolean = DEFAULT_COMPARATOR): boolean {
    if (arr1.length !== arr2.length) return false
    const len = arr1.length
    for (let index = 0; index < len; ++index) {
        if (!comparator(arr1[index], arr2[index])) return false
    }
    return true
}