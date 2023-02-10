export class RequestType<T> {
    public constructor(
        public readonly name: string
    ) {
    }
}

type Converter<T> = (req: T) => URLSearchParams

export class Requests {
    private static converters: Map<RequestType<any>, Converter<any>> = new Map()

    public static requestToParams<T>(type: RequestType<T>, request: T): URLSearchParams {
        const converter = this.converters.get(type)
        if (!converter) throw new Error('No such a converter[type: ' + type.name + ']')
        return converter(request)
    }

    public static register<T>(type: RequestType<T>, convert: Converter<T>) {
        this.converters.set(type, convert)
    }
}