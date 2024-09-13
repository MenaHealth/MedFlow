// components/auth/SecurityQuestionsForm.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdownMenu";
import { TextFormField } from "@/components/ui/TextFormField";
import { securityQuestions } from "@/utils/securityQuestions.enum";
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
    onDataChange: (data: SecurityQuestionsFormValues) => void;
    formData: Partial<SecurityQuestionsFormValues>;
}

const SecurityQuestionsForm: React.FC<Props> = ({ onDataChange, formData }) => {
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
        setSelectedQuestions([
            formData.question1 || '',
            formData.question2 || '',
            formData.question3 || '',
        ]);
    }, [formData]);

    const updateSelectedQuestions = (questionNumber: string, selectedQuestion: string) => {
        form.setValue(questionNumber as "question1" | "question2" | "question3", selectedQuestion);
        setSelectedQuestions(prev => {
            const newSelected = [...prev];
            newSelected[parseInt(questionNumber.slice(-1)) - 1] = selectedQuestion;
            return newSelected;
        });
    };

    const handleSubmit = form.handleSubmit((data: SecurityQuestionsFormValues) => {
        onDataChange(data);
    });

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                                    id={`question${num}`}
                                    autoComplete="off"
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
                            fieldLabel={`Your Answer for Question ${num}`}
                            id={`answer${num}`}
                            autoComplete="off"
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary w-full">
                    Save Security Questions
                </button>
            </form>
        </div>
    );
};

export default SecurityQuestionsForm;