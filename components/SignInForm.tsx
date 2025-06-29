"use client";

import { useSignIn } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import { useState } from "react";


export default function SignInForm() {
    const router = useRouter();
    const { signIn, isLoaded, setActive} = useSignIn();
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ authError, setAuthError] = useState<string | null>(null)

    const { 
        register,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        if(!isLoaded) return
        setIsSubmitting(true)
        setAuthError(null)


        try{
            const result=  await signIn.create({
                identifier: data.identifier,
                password: data.password,
            })
            if (result.status === "complete"){
                await setActive({session:result.createdSessionId})

            }else{
                setAuthError("Sign in failed. Please check your credentials and try again.");
            }
        }catch (error){
            console.error("Error during sign in:", error);
            setAuthError(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally{
            setIsSubmitting(false);
        }
    };





    return(
        <h1>
            Sign In Form Component
        </h1>
    )
}