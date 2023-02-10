export function TODO(name: string = ''): () => void {
    if (name) {
        return () => console.log(`${name} is not implemented yet.`)
    } else {
        return () => console.log('Not implemented yet.')
    }
}