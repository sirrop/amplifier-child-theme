import {User} from "./User"

export class Guest {
    /**
     * @deprecated
     */
    public static getInstance(): User {
        return User.getGuest()
    }
}