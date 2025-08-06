import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "./dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any>{
                // now from this credentials we can extract information like email and password
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Misssing email or password");
                }

                try{
                    await connectToDb();
                    const user = await userModel.findOne({
                        $or: [
                            {email: credentials.email},
                            {username: credentials.email}
                        ]
                    });

                    if(!user){
                        throw new Error("No user found through this email");
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account first");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error("Incorrect Password");
                    }
                }catch(error: any){
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            // we want to make the token powerfull so store full user information, normaly only user id is stored
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            
            return token
        },
        async session({ session, token }) {
            // after updating tokens lets update sessions
            if(token){
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessages = token.isAcceptingMessages,
                session.user.username = token.username
            }

            return session
        }
    },
    pages: {
        signIn: '/sign-in',
        error: "/sign-in"
    },
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 60 * 60 //1 days max age,
    },
    secret: process.env.NEXTAUTH_SECRET
}