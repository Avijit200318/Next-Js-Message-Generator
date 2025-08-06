import userModel from "@/model/User";
import { connectToDb } from "@/lib/dbConnect";
import { z } from "zod";
// to use zod we must need a schema. for this case we need username
import { verifySchema } from "@/schemas/verifySchema";
import { NextRequest, NextResponse } from "next/server";

// write Query to verifycode is valid
// const verifyCodeQuerySchema = z.object({
//     verifyCode: verifySchema
// })
// since verifyScema contain object because of that we don't need this privious codes to check. we chcke this for username because that was string

export async function POST(req: NextRequest) {
    await connectToDb();

    try {
        const { username, code } = await req.json();

        // Validate input using Zod
        const result = verifySchema.safeParse({ code });

        if (!result.success) {
            const codeErrors = result.error.format().code?._errors || [];
            return NextResponse.json(
                {
                    success: false,
                    message:
                        codeErrors.length > 0
                            ? codeErrors.join(", ")
                            : "Invalid verification code",
                },
                { status: 400 }
            );
        }

        // when we get information throw url we need to decode them
        const decodedUsername = decodeURIComponent(username);
        const user = await userModel.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return NextResponse.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 });
        } else if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "Verification code expired, please signup again to get a new code"
            }, { status: 400 });
        } else {
            return NextResponse.json({
                success: false,
                message: "Incorrect verification code"
            }, { status: 400 });
        }

    } catch (error) {
        console.error("Error veifying code: ", error);
        return NextResponse.json({
            success: false,
            message: "Error verifying code"
        }, { status: 500 });
    }
}