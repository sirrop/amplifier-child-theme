export function vibrateOnce(): boolean {
    if (!navigator.vibrate) return false
    return navigator.vibrate(200)
}