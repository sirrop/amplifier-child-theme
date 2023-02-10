export const UserType = {
    GUEST: 'guest',
    STUDENT: 'asmo_undergraduate_student',
    CLUB: 'asmo_club'
} as const

export type UserType = typeof UserType[keyof typeof UserType]