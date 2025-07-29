import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/model/User";
import messageModel from "@/model/Message";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await connectToDb();

    try{
        const {username, email, password} = await req.json();
        // await use must to get infromation in next js
        const existingUserVerifiedByUsername = await userModel.findOne({username, isVerified: true});

        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400});
        }

        const existingUserByEmail = await userModel.findOne({email});
        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();


        if(existingUserByEmail){
            // if email exist and veiried then a case and if not then other case
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success: false,
                    message: "User already exist with this email"
                }, {status: 400});
            }else{
                // if email exist but not verified the update password
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();
            }
        }else{
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            // we set is const but since new Date() give us an object so we can change its value anytime. This code add 1hrs expiry to the expiry Date

            const newUser = await userModel.create({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessages: false,
                isVerified: true,
                messages: []
            });

        }
        // send verification email
        const emailResponse= await sendVerificationEmail(email, username,verifyCode);

        // check console.log emailResponse

        if(!emailResponse.success){
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            }, {status: 500});
        }

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verifyyouremail"
        }, {status: 201});
    }catch(error){
        console.error("Error registering user: ", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        },
        {status: 500}
        )
    }
}