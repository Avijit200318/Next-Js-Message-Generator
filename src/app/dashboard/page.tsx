"use client"
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { IMessage } from '@/model/Message';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Types } from 'mongoose';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {z} from "zod";

export default function page() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  console.log("messages: ", messages)

// now here we are going to use optimistic ui. means we are going to change the ui first then we will change the server data. if req fails then we will update the ui again

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId));
  }

  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema)
  })

  // extract these things from form-> useForm
  const {register, setValue, watch} = form;
  // see the uses of setValue and watch in react-hook-forms. setValue immediately change the value to UI.

  const acceptMessages = watch('acceptMessages');

  // if we are creating tooggle type things then we need to use useCallback hook
  const fetchAcceptMessage = useCallback(async () => {
    try{
      setIsSwitchLoading(true);
      const res = await axios.get<ApiResponse>("/api/accept-messages")
      setValue('acceptMessages', res.data.isAcceptingMessages ?? false)
    }catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(`${axiosError.response?.data.message || "Failed to fetch message settings"}`);
    } finally{
      setIsSwitchLoading(false);
    }
  }, [setValue]);
  // so when the value will change the useCallback will run

  // refresh we are going to send and it is a boolean variable whose default value we set to false
  const fetchMessages = useCallback( async (refresh:boolean = false)=> {
    setIsSwitchLoading(true);
    setLoading(true);
    try{
      const res = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(res.data.messages);
      if(refresh){
        toast.success("Refreshed Messages");
      }
    }catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(`${axiosError.response?.data.message || "Failed to fetch messages"}`);
    } finally{
      setIsSwitchLoading(false);
      setLoading(false);
    }
  }, [setLoading, setMessages]);

  useEffect(() => {
    if(!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // handle switch change
  const handleSwitchChange = async () => {
    try{
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages
      });

      if(res.data.success === false){
        toast.error("Error changing switch");
        return;
      }

      setValue('acceptMessages', !acceptMessages);
      toast.success(res.data.message);
    }catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(`${axiosError.response?.data.message || "Failed to switch"}`);
    }
  }

//     if (status === "loading") {
//   return <p>Loading...</p>;
// } 
if(!session || !session.user){
    return <>Please Login</>
  }
  
  const {username} = session?.user as User;
  // get baseurl
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  
  // copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL Copied");
  }

  // if(!session || !session.user || status === "loading"){
  //   return <>Please Login</>
  // }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        {/* since we don't have name in the filed switch and we only have one filed so we use react hook form in this format. we destructured it then use it */}
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages
          .map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}
