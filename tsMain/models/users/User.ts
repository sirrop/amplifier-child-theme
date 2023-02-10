import {UserType} from "./UserType";

type Args = {
    id: number
    name: string
    icon: string
    slug: string
    role?: UserType
    bio?: string
    likes: PublicationIDs
    shares: PublicationIDs
    follows?: number[]
    followers?: number[]
    stars?: number[]
    blackList?: number[]
    bookingList: number[]
}

type PublicationIDs = {
    posts: number[]
    comments: number[]
}

const GUEST_ARGS: Args = {
    id: 0,
    name: 'ゲスト',
    slug: 'guest',
    icon: 'https://secure.gravatar.com/avatar/631bb9d9d0e139be7bc3409f23e653fe?s=96&d=mm&r=g',
    likes: { posts: [], comments: [] },
    shares: { posts: [], comments: [] },
    bookingList: []
}

export class User {
    private static guest: User

    private constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly icon: string,
        public readonly slug: string,
        public readonly role: UserType,
        public readonly bio: string,
        public readonly likes: PublicationIDs,
        public readonly shares: PublicationIDs,
        public readonly follows: number[],
        public readonly followers: number[],
        public readonly stars: number[],
        public readonly blackList: number[],
        public readonly bookingList: number[]
    ) {}

    public static getGuest(): User {
        if (!User.guest) {
            const {
                id,
                name,
                icon,
                slug,
                role,
                bio,
                likes,
                shares,
                follows,
                followers,
                stars,
                blackList,
                bookingList
            } = GUEST_ARGS
            User.guest = new User(id, name, icon, slug, role, bio, likes, shares, follows, followers, stars, blackList, bookingList)
        }
        return User.guest
    }

    public static isGuest(user: User): boolean {
        return user === this.getGuest()
    }

    public static of(args: Args): User {
        const {
            id,
            name,
            icon,
            slug,
            role = UserType.STUDENT,
            bio = '',
            likes,
            shares,
            follows = [],
            followers = [],
            stars = [],
            blackList = [],
            bookingList
        } = args

        if (id === 0) {
            return User.getGuest()
        }

        if (role === UserType.GUEST) {
            throw new Error();
        }

        return new User(
            id,
            name,
            icon,
            slug,
            role,
            bio,
            likes,
            shares,
            follows,
            followers,
            stars,
            blackList,
            bookingList
        )
    }
}