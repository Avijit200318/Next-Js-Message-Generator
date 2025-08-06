'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from "axios";

// implement shadcn
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from 'next/link';

import { toast } from "sonner"

// use debounce
import { useDebounceCallback } from 'usehooks-ts';
import { signUpValidation } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react"

export default function page() {
    const [username, setUsername] = useState<string>('');
    const [usernameMessage, setUsernameMessage] = useState<string>('');
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const debounced = useDebounceCallback(setUsername, 400);

    const router = useRouter();

    // zod implementation
    const form = useForm<z.infer<typeof signUpValidation>>({
        // z.infer is to tell the form, that your type is this. the abovel lise is either form or register
        resolver: zodResolver(signUpValidation),
        // zodResolver need a schema
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');

                try {
                    const res = await axios.get(`/api/auth/check-username-unique?username=${username}`);

                    if (res.data.success === false) {
                        console.log("Some error occur");
                        setUsernameMessage(res.data.message);
                        return;
                    }

                    console.log(res);
                    setUsernameMessage(res.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
                }
                finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUniqueUsername();
    }, [username]);


    const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
        setIsSubmitting(true);
        try {
            const res = await axios.post<ApiResponse>("/api/auth/sign-up", data);
            
            if(res.data.success === false){
                console.error("Sign up route error: ", res.data.message);
                toast.error("Sign up route error");
                return;
            }
            router.replace(`/verify/${username}`);
        } catch (error) {
            console.error("Error in signup of user: ", error);
            // const errorMessage = error as AxiosError<ApiResponse>;
            toast.error("Sign up failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-800'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6">Join True Feedback</h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }} />
                                    </FormControl>
                                    { isCheckingUsername && <Loader2 className='animate-spin' /> }
                                    <p className={`text-sm ${usernameMessage === "Username is unique"? 'text-green-500' : 'text-red-700'} font-semibold`}> {usernameMessage.length !== 0? `text ${usernameMessage}` : ''}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                        {/* we don't need here onChange in case of username we need that because of debouncing */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? (<><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</>) : 'Sign Up'}</Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
