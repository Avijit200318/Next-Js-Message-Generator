import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface User{
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string
    }

    interface Session {
        user: {
            _id?: string,
            isVerified?: boolean,
            isAcceptingMessages?: boolean,
            username?: string
        } & DefaultSession['user']
    }
}

// we also have to assign jwt types because with out this when we are updating the session sections it will give us a type error for toekns
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string
    }
}