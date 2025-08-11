import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/model/User";
import messageModel from "@/model/Message";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, {params}: {params: {messageId: string}}) {
    const messageId = params.messageId;
    // using params to get messageId
    await connectToDb();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: 'Not authenticated'
        },{ status: 401 });
    }

    try{
        const udpateResult =await userModel.updateOne(
            {_id: user?._id},
            { $pull: { messages: messageId }}
        );

        await messageModel.findByIdAndDelete(messageId);

        if(udpateResult.modifiedCount === 0){
            return NextResponse.json({
            success: false,
            messages: "Message not found or already deleted"
            },{ status: 404 });
        }

        return NextResponse.json({
            success: true,
            messages: "Message Deleted Successfully"
        },{ status: 200 });
    }catch(error){
        console.log("Error in delete message route: ", error);
        return NextResponse.json({
                success: false,
                message: 'Error deleting message'
            },{ status: 500 });
    }
}