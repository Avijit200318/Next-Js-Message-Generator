"use client"
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifySchema } from '@/schemas/verifySchema';

import { toast } from "sonner"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function VerifyAccount() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams<{ username: string }>();

    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        // z.infer is to tell the form, that your type is this. the abovel lise is either form or register
        resolver: zodResolver(verifySchema),
        // zodResolver need a schema
        defaultValues: {
            code: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setLoading(true);
            const res = await axios.post(`/api/auth/verify-code`, {
                username: params.username,
                code: data.code
            });

            if (res.data.success === false) {
                console.error("Verification error");
                toast.error(res.data.message);
                return;
            }

            toast.success(res.data.message);
            router.replace("/sign-in");
        } catch (error) {
            console.error("Error in signup of user: ", error);
            const errorMessage = error as AxiosError<ApiResponse>;
            toast.error(`Sign up failed: ${errorMessage}`);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            name="code"
                            // we have to write here some name that present in zod schema
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit'>{loading? <><Loader2 className='animate-spin'/> Please wait</> : "Submit"}</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
