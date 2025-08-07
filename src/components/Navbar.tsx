"use client"
import React from 'react'
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {User} from "next-auth";
import { Button } from './ui/button';
// this user have all the session data

export default function Navbar() {
    const {data: session} = useSession();
    // from this data we will get is session is active or not. user is logedin or not.

    // the user information we will get from "User" and all the session data will inject inside User session

    const user:User = session?.user as User;
    // as User means now the user variable always get the user type data

  return (
    <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a href="#" className='text-xl font-bold mb-4 md:mb-0'>Mystry Message</a>
            {
                session? (
                    <>
                        <span className="mr-4">Welcome, {user?.username || user?.email}</span>
                        <Button onClick={ ()=> signOut() } className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>Logout</Button>
                    </>
                ):(
                    <Link href="/sign-in">
                        <Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}
