import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
// this ApiResponse we created for type safety and to optimize things. we write it inside the types folder

export const sendVerificationEmail = async (email: string, username: string, verifyCode: string): Promise<ApiResponse> => {
    try {
        // email sending code-> copy it from the react email
        // then change some values like, from, to, subject and react
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'NEXT JS Project Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
        });

        return { success: true, message: "Verification email send successfully" };
    } catch (error) {
        console.error("Error sending verification email: ", error);
        return { success: false, message: "Failed to send verification email" }
    }
}