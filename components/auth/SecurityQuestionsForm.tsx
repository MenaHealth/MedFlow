    import React, { useEffect, useState } from "react";
    import { useForm } from "react-hook-form";
    import { z } from 'zod';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdownMenu";
    import { TextFormField } from "@/components/ui/TextFormField";
    import { securityQuestions } from "@/utils/securityQuestions.enum";
    import { FormProvider } from "react-hook-form";
    import { useSignupContext } from "@/components/auth/SignupContext";

    const securityQuestionsSchema = z.object({
        question1: z.string().min(1, "Please select a security question"),
        answer1: z.string().min(1, "Please provide an answer"),
        question2: z.string().min(1, "Please select a security question"),
        answer2: z.string().min(1, "Please provide an answer"),
        question3: z.string().min(1, "Please select a security question"),
        answer3: z.string().min(1, "Please provide an answer"),
    });

    export type SecurityQuestionsFormValues = z.infer<typeof securityQuestionsSchema>;

    const SecurityQuestionsForm: React.FC = () => {
        const { formData, setFormData, setIsFormComplete } = useSignupContext();
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
            const subscription = form.watch((data) => {
                setFormData((prevData) => ({ ...prevData, ...data }));
                if (!form.formState.isValidating) {
                    setIsFormComplete(form.formState.isValid);
                    console.log('isFormComplete:', form.formState.isValid);
                }
            });

            return () => subscription.unsubscribe();
        }, [form, setFormData, setIsFormComplete]);

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
                <FormProvider {...form}>
                    <form className="space-y-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full">
                                        <TextFormField
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
                                    fieldName={`answer${num}`}
                                    fieldLabel={`Your Answer for Question ${num}`}
                                    id={`answer${num}`}
                                    autoComplete="off"
                                />
                            </div>
                        ))}
                    </form>
                </FormProvider>
            </div>
        );
    };

    export default SecurityQuestionsForm;