import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    tempCode: z.string().nonempty("Verification code is required").min(6, "Verification code must be 6 characters long"),
    securityAnswer: z.string().nonempty("Security answer is required."),
    newPassword: z.string().min(8, "Password must be at least 8 characters and contain at least one number"),
    confirmNewPassword: z.string().nonempty("Confirm Password is required"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
});

export interface ForgotPasswordFormValues {
    email?: string;
    tempCode?: string;
    securityAnswer?: string;
    newPassword: string;
    confirmNewPassword: string;
}

// Define the SecurityQuestion interface here
export interface SecurityQuestion {
    question: string;
    questionId: string;
}