import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(4, "Username must be atleast 2 charecters")
    .max(10, "Username must be less than 10 charecters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain spacial character")


export const signUpValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be at least 6 characters"})
})