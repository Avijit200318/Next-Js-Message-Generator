import mongoose from "mongoose"

export interface ApiResponse{
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Array<mongoose.Types.ObjectId>
}