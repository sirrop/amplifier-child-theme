import UUIDClass from "uuidjs";
import { Buffer } from "buffer"

export class UUID {
    private constructor() {
    }

    static generate(): string {
        return UUIDClass.generate()
    }

    static generateShort(): string {
        const modalId = this.generate()
            .split("-")
            .join()
            .split("")
            .map((str) => parseInt(str, 16))
        return Buffer.from(modalId)
            .toString("base64")
            .replace("==", "")
    }
}