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
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react"
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';

export default function page() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    // z.infer is to tell the form, that your type is this. the abovel lise is either form or register
    resolver: zodResolver(signInSchema),
    // zodResolver need a schema
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true);
      // next auth sign in process
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      });
      // console.log(result)

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          toast.error("Login failded incorrect username or password");
        } else {
          toast.error(`Error: ${res.error}`);
        }
      }

      if (res?.ok && res?.url) {
        toast.success("Login Successfull");
        router.replace('/dashboard');
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Sign in error:", error);
    }finally{
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6">Join True Feedback</h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name="email"
              // change name to email -> identifier
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field} />
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
            <Button type='submit' disabled={isSubmitting}>{isSubmitting ? (<><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</>) : 'Sign In'}</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
