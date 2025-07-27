import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

export const connectToDb = async (): Promise<void> => {
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

        connection.isConnected = db.connections[0].readyState;
        //console.log the db to check all the information that we get

        console.log("Db connected successfully");
    }catch(error){
        console.log("Database connection failed", error);
        process.exit(1);
    }
}
