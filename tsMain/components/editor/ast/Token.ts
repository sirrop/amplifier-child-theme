export const TokenType = {
    TEXT: "text",               // 通常の文を表すTokenType
    NEXT_LINE: "next_line",     // 改行を表すTokenType
    HASH: "hash",               // ハッシュタグを表すTokenType
    AT: "at"                    // メンションを表すTokenType
} as const

export type TokenType = typeof TokenType[keyof typeof TokenType]

export interface Token {
    index: number
    type: TokenType
    image: string
}