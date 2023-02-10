export interface ValidationResult {
    readonly isValid: boolean
    readonly message?: string
    onInvalid(action: (mes?: string) => void): ValidationResult
    onValid(action: () => void): ValidationResult
}

export interface Validator extends ValidationResult {
    next(predict: boolean, message?: string): Validator
}

export function validate(predict: boolean, message?: string): Validator {
    return new ValidatorImpl(predict, message)
}

class ValidatorImpl implements Validator {
    constructor(
        public readonly isValid: boolean,
        public readonly message?: string
    ) {}

    next(predict: boolean, message?: string): Validator {
        if (!this.isValid) return this
        return new ValidatorImpl(predict, message)
    }

    onInvalid(action: (mes?: string) => void): ValidationResult {
        if (!this.isValid) action(this.message)
        return this
    }

    onValid(action: () => void): ValidationResult {
        if (this.isValid) action()
        return this
    }
}