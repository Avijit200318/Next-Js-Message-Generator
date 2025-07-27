import {z} from "zod";

export const signInSchema = z.object({
    email: z.string(),
    // identifier:
    password: z.string(),
})