import mongoose, {Schema, Document, Types, models, model} from "mongoose";
import { IMessage } from "./Message";
// we are using Document to implement type safty.

export interface IUser extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isAcceptingMessages: boolean,
    isVerified: boolean,
    messages: Types.ObjectId[] | IMessage[]
};

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/.+@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verify code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [{
    type: Schema.Types.ObjectId,
    ref: "Message",
  }]
})

const User = models?.User || model<IUser>("User", userSchema);

export default User;