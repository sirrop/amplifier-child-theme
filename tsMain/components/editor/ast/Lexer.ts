import {Token, TokenType} from "./Token";

export function lexer(text: string): Token[] {
    let start: number = 0
    let type: TokenType = TokenType.TEXT
    const len: number = text.length
    let result: Token[] = []

    for (
        let index: number = 0;
        index < len;
        ++index
    ) {
        const image = text.charAt(index)
        switch (type) {
            case TokenType.TEXT: {
                if (image === '#') {
                    result.push({
                        index: start,
                        type: TokenType.TEXT,
                        image: text.substring(start, index)
                    })
                    type = TokenType.HASH
                    start = index
                }

                if (image === '@') {
                    result.push({
                        index: start,
                        type: TokenType.TEXT,
                        image: text.substring(start, index)
                    })
                    type = TokenType.AT
                    start = index
                }

                if (image === '\r') {
                    if (index + 1 < len) {
                        const position = index

                        // 一つ先読みして\nがあるか確認
                        const char = text.charAt(index + 1)
                        if (char === 'n') {
                            index += 1
                        }

                        result.push({
                            index: start,
                            type: TokenType.TEXT,
                            image: text.substring(start, position)
                        })
                        result.push({
                            index: position,
                            type: TokenType.NEXT_LINE,
                            image: ''
                        })
                        type = TokenType.TEXT
                        start = index
                    }
                }

                if (image === '\n') {
                    result.push({
                        index: start,
                        type: TokenType.TEXT,
                        image: text.substring(start, index)
                    })
                    result.push({
                        index: index,
                        type: TokenType.NEXT_LINE,
                        image: ''
                    })
                    type = TokenType.TEXT
                    start = index
                }
                break
            }
            case TokenType.HASH: {
                if (image === ' ' || image === '\n') {
                    result.push({
                        index: start,
                        type: TokenType.HASH,
                        image: text.substring(start, index)
                    })
                    type = TokenType.TEXT
                    start = index
                }
                break
            }
            case TokenType.AT: {
                if (image === ' ' || image === '\n') {
                    result.push({
                        index: index,
                        type: TokenType.AT,
                        image: text.substring(start, index)
                    })
                    type = TokenType.TEXT
                    start = index
                }
                break
            }
        }
    }

    result.push({
        index: start,
        type: type,
        image: text.substring(start, len)
    })

    return result
}