"use client"
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { IMessage } from '@/model/Message'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import dayjs from "dayjs";

type MessageCardProps = {
    message: IMessage,
    onMessageDelete: (messageId: string) => void
}

// so the props type will be message which type is IMessage and a onMessageDelete which will be a function of type void. we will pass messageId string

export default function MessageCard({message, onMessageDelete}: MessageCardProps) {
    console.log("message: ", message)

    const handleDeleteConfirm = async () => {
        const res = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast(`${res.data.message}`);
        onMessageDelete(message._id.toString());
        // update this line
    }

    return (
        <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
    )
}
