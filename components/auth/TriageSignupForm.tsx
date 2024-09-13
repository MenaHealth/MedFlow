// components/auth/TriageSignupForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const triageSignupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
});

type TriageSignupFormValues = z.infer<typeof triageSignupSchema>;

const TriageSignupForm = ({ onNext, onBack }: { onNext: (data: TriageSignupFormValues) => void, onBack: () => void }) => {
    const form = useForm<TriageSignupFormValues>({
        resolver: zodResolver(triageSignupSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            dob: '',
        },
    });

    const handleSubmit = (data: TriageSignupFormValues) => {
        onNext(data);
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Triage Specialist Signup</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <TextFormField form={form} fieldName="firstName" fieldLabel="First Name" />
                    <TextFormField form={form} fieldName="lastName" fieldLabel="Last Name" />
                    <TextFormField form={form} fieldName="dob" fieldLabel="Date of Birth (MM/DD/YYYY)" type="date" />
                    <div className="flex justify-between mt-8">
                        <Button type="button" onClick={onBack} className="bg-gray-300 hover:bg-gray-400 text-black">
                            Back
                        </Button>
                        <Button type="submit" className="bg-orange hover:bg-lightOrange shadow-[0_4px_6px_var(--orange)]">
                            Next
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default TriageSignupForm;