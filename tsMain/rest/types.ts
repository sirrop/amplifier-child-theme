export const OrderType = {
    ASC: 'asc',
    DESC: 'desc'
} as const

export type OrderType = typeof OrderType[keyof typeof OrderType]