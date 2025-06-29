import * as z from "zod";

export const signUpschema = z.object({
    email: z
        .string()
        .min(1, {message: "Email is required"})
        .email({message: "plz give a valid email "}),
    password:z 
         .string()
         .min(1, {message: "password is required"})
         .min(8, {message: "password must be at least 8 characters long"}),
    passwordConfirmation:z
         .string()
         .min(1, {message: "password confirmation is required"})


    

}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path : ["passwordConfirmation"],
})