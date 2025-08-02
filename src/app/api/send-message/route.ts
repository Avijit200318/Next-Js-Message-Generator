import userModel from "@/model/User";
import { connectToDb } from "@/lib/dbConnect";
import messageModel, { IMessage } from "@/model/Message";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    await connectToDb();

    const {username, content} = await req.json();
    try{
        const user = await userModel.findOne({username});
        if(!user){
            return NextResponse.json({
                success: false,
                message: 'User not found'
            },{ status: 404 });
        }

        // is user accepting the messages
        if(!user.isAcceptingMessages){
            return NextResponse.json({
                success: false,
                message: 'User is not accepting the messages'
            },{ status: 403 });
        }

        const newMessage = await messageModel.create({
            content,
            createdAt: new Date()
        });

        user.messages.push(newMessage._id);
        await user.save();

        return NextResponse.json({
                success: true,
                message: "Message send successfully"
            },{ status: 200 });
    }catch(error){
        console.log("Error adding messages: ", error);
        return NextResponse.json({
                success: false,
                message: 'Internal server error'
            },{ status: 500 });
    }
}