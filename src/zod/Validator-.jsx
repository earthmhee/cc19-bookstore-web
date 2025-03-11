import { z } from "zod";

exports.registerUser = z.object({
    email: z.string().email(),
    // firstName: z.string().min(3, "firstname must contain at least 3 characters"),
    // lastName: z.string().min(3,"lastname must contain at least 3 characters"),
    username: z.string().min(6, "username must contains at least 6 character."),
    password: z.string().min(6, "password must contains at least 6 character."),
    confirmPassword:  z.string().min(6, "password must contain at least 6 characters")
}).refine((data)=> data.password === data.confirmPassword,{
    message: "Password Is NOT Matched",
    path: ["confirmPassword"]
})