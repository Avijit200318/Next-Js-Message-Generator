import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";
// this next-auth user is to assing the type of user
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

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

    // const userId = user?._id;
    // now here is a common mistake during aggrigation pipeline if the user id is string then it return an error. and inside the session we convert the userId to string. so we have to convert it

    const userId = new mongoose.Types.ObjectId(user?._id);

    try{
        // mongodb pipeline -> since I change the structure thsi code not needed
        // const user = await userModel.aggregate([
        //     {$match: {_id: userId}},
        //     {$unwind: '$messages'},
        //     {$sort: {'messages.createdAt': -1}},
        //     {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        // ])

        const user = await userModel.findById(userId).populate({
            path: "messages",
            options: { sort: { createdAt: -1 } }  // sort by newest first
        });

        // if(!user || user.length === 0) condition not needed since now we will get null or a single document
        if(!user){
            return NextResponse.json({
                success: false,
                message: 'User not found'
            },{ status: 401 });
        }

        return NextResponse.json({
            success: true,
            // messages: user[0].messages -> this line also updated
            messages: user.messages
        },{ status: 200 });
    }catch(error){
        console.log("An unexpected error occur: ", error);
        return NextResponse.json({
                success: false,
                message: 'User not authenticated'
            },{ status: 500 });
    }
}