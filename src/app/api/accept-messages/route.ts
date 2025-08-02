import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";
// this next-auth user is to assing the type of user
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    await connectToDb();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: 'Not authenticated'
        },{ status: 401 });
    }

    const userId = user?._id;
    const { acceptMessages } = await req.json();

    try{
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            {new: true}
        );

        if (!updatedUser) {
            return NextResponse.json({
            success: false,
            message: 'Unable to find user to update message acceptance status'
            },{ status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Message acceptance status updated successfully',
            updatedUser,
        },{ status: 200 });
    }catch(error){
        console.error('Error updating message acceptance status:', error);
        return NextResponse.json({
            success: false,
            message: 'Error updating message acceptance status'
        },{ status: 500 });
    }
};

export async function GET(req: NextRequest) {
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
        const foundUser = await userModel.findById(user?._id);

        if(!foundUser){
            return NextResponse.json({
            success: false,
            message: 'User not found'
            },{ status: 404 });
        }

        return NextResponse.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        },{ status: 200 });
    }catch(error){
        console.error('Error retrieving message acceptance status:', error);
        return NextResponse.json({
            success: false,
            message: 'Error retrieving message acceptance status'
        },{ status: 500 });
    }
}