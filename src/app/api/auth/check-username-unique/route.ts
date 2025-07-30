import userModel from "@/model/User";
import { connectToDb } from "@/lib/dbConnect";
import {z} from "zod";
// to use zod we must need a schema. for this case we need username
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";


// write Query to check if username is valid
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: NextRequest) {
    await connectToDb();

    try{
        // fetch the parames -> loc../api/check-..?username=avijit?xyz=dkfj
        const {searchParams} = new URL(req.url);
        const queryParam = {
            username: searchParams.get("username")
        }

        // validate username using zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        // console.log the result
        console.log("result: ",result);
        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];

            return NextResponse.json({
            success: false,
            message: usernameError?.length > 0 ? usernameError.join(', ') : 'Invalid query parameters'
            }, {status: 400});
        }

        const {username} = result.data;

        const existingVerifiedUser = await userModel.findOne({username, isVerified: true});

        if(existingVerifiedUser){
            return NextResponse.json({
            success: false,
            message: "Username is already taken"
            }, {status: 400});
        }

        return NextResponse.json({
            success: true,
            message: "Username is unique"
        }, {status: 200});

    }catch(error){
        console.error("Error checking username ", error);
        return NextResponse.json({
            success: false,
            message: "Error checking username"
        }, {status: 500});
    }
}