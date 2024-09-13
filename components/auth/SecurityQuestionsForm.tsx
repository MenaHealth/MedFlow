// components/auth/SecurityQuestionsForm.tsx
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdownMenu";
import { TextFormField } from "@/components/ui/TextFormField";
import { securityQuestions } from "@/utils/securityQuestions.enum";
import { useEffect, useState } from "react";
import useToast from "@/components/hooks/useToast";

const securityQuestionsSchema = z.object({
    question1: z.string().min(1, "Please select a security question"),
    answer1: z.string().min(1, "Please provide an answer"),
    question2: z.string().min(1, "Please select a security question"),
    answer2: z.string().min(1, "Please provide an answer"),
    question3: z.string().min(1, "Please select a security question"),
    answer3: z.string().min(1, "Please provide an answer"),
});

export type SecurityQuestionsFormValues = z.infer<typeof securityQuestionsSchema>;

interface Props {
    onDataChange: (data: any) => void;
    formData: any;
}

const SecurityQuestionsForm = ({ onDataChange, formData }: Props) => {
    const { setToast } = useToast();
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

    const form = useForm<SecurityQuestionsFormValues>({
        resolver: zodResolver(securityQuestionsSchema),
        defaultValues: {
            question1: formData.question1 || '',
            answer1: formData.answer1 || '',
            question2: formData.question2 || '',
            answer2: formData.answer2 || '',
            question3: formData.question3 || '',
            answer3: formData.answer3 || '',
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            onDataChange(value);
        });
        return () => subscription.unsubscribe();
    }, [form, onDataChange]);

    useEffect(() => {
        setSelectedQuestions([
            formData.question1 || '',
            formData.question2 || '',
            formData.question3 || '',
        ]);
    }, [formData]);

    const handleError = () => {
        setToast({
            title: "Error",
            description: "Security questions are required",
            variant: "destructive",
        });
    };

    const updateSelectedQuestions = (questionNumber: string, selectedQuestion: string) => {
        form.setValue(questionNumber as "question1" | "question2" | "question3", selectedQuestion);
        setSelectedQuestions(prev => {
            const newSelected = [...prev];
            newSelected[parseInt(questionNumber.slice(-1)) - 1] = selectedQuestion;
            return newSelected;
        });
    };

    return (
        <div className="max-w-md mx-auto">
            <form className="space-y-4">
                {[1, 2, 3].map((num) => (
                    <div key={num}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full">
                                <TextFormField
                                    form={form}
                                    fieldName={`question${num}`}
                                    fieldLabel={`Security Question ${num}`}
                                    className="w-full"
                                    disabled
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {securityQuestions
                                    .filter(question => !selectedQuestions.includes(question) || question === form.getValues(`question${num}`))
                                    .map((question, index) => (
                                        <DropdownMenuItem key={index} onSelect={() => updateSelectedQuestions(`question${num}`, question)}>
                                            {question}
                                        </DropdownMenuItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <TextFormField
                            form={form}
                            fieldName={`answer${num}`}
                            fieldLabel="Your Answer"
                        />
                    </div>
                ))}
            </form>
        </div>
    );
};

export default SecurityQuestionsForm;