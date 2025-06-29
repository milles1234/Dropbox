"use client"

import {useForm} from "react-hook-form";
import { useSignUp} from "@clerk/nextjs";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

//zod  custom schema that i created
import { signUpschema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignUpForm(){
    const router = useRouter();
    const [ verifying, setVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autherror, setAuthError] = useState<string | null>(null);
    const [VerificationError, setVerificationError] = useState<string | null>(null);
    const [Verificationcode, setVerificationCode] = useState("");
    const { signUp, isLoaded, setActive } = useSignUp();

    const{
        register,
    
        formState: { errors },

    }= useForm<z.infer<typeof signUpschema>>({
        resolver: zodResolver(signUpschema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        }
    })


    
    
    const onSubmit = async (data: z.infer<typeof signUpschema >) => {
        if(!isLoaded) return;
        setIsSubmitting(true);
        setAuthError(null);

        try{
            await signUp.create({
                emailAddress: data.email,
                password: data.password
            })
            await signUp.prepareEmailAddressVerification({
                strategy:"email_code"
            })
            setVerifying(true);

        }catch(error:any){
            console.error("Error during sign up:", error);
            setAuthError(error.message || "An unexpected error occurred");

        }finally{
            setIsSubmitting(false);
        }

    };

    const  handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!isLoaded || !signUp) return;
        setIsSubmitting(true);
        setAuthError(null);
        try{
            const result = await signUp.attemptEmailAddressVerification({
                code: Verificationcode
            })
            if(result.status === "complete"){
                await setActive({session: result.createdSessionId});
                router.push("/dashboard");
            }else{
                console.error("Verification failed:", result.status);
                setVerificationError("Verification failed. Please check your code and try again.");
            }
             
        }catch(error){
            setVerificationError("An error occurred during verification");

    };

    if (verifying){
        return <h1> this is OTP entering field</h1>;
    }

    return <h1>signup form with your email or other feilds defined</h1>
    



}}

