import mongoose, {Schema, Document, model, models} from "mongoose";
// we are using Document to implement type safty.

export interface IMessage extends Document{
    content: string,
    createdAt: Date
};

const messageSchema = new Schema<IMessage>({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Message = models?.Message || model<IMessage>("Message", messageSchema);

export default Message;