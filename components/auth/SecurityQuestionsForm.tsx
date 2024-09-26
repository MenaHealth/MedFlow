// components/auth/SecurityQuestionsForm.tsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { securityQuestions } from "@/data/securityQuestions.enum";
import { useSignupContext } from "@/components/auth/SignupContext";
import { Card } from "@/components/ui/card";
import { SingleChoiceFormField } from "@/components/form/SingleChoiceFormField";

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
    const { formData, setFormData, updateAnsweredQuestions, setSecurityQuestionFormCompleted } = useSignupContext();
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

    const form = useForm<SecurityQuestionsFormValues>({
        resolver: zodResolver(securityQuestionsSchema),
        defaultValues: {
            question1: formData.question1 || "",
            answer1: formData.answer1 || "",
            question2: formData.question2 || "",
            answer2: formData.answer2 || "",
            question3: formData.question3 || "",
            answer3: formData.answer3 || "",
        },
        mode: "onChange",
    });

    const questionRef1 = useRef<HTMLDivElement>(null);
    const questionRef2 = useRef<HTMLDivElement>(null);
    const questionRef3 = useRef<HTMLDivElement>(null);

    const questionRefs = useMemo(() => [questionRef1, questionRef2, questionRef3], []);

    const [isCompleted, setIsCompleted] = useState([false, false, false]);

    useEffect(() => {
        const subscription = form.watch((values) => {
            setFormData((prevData) => ({
                ...prevData,
                question1: values.question1,
                answer1: values.answer1 || "", // Ensure answer1 is a string
                question2: values.question2,
                answer2: values.answer2 || "",
                question3: values.question3,
                answer3: values.answer3 || "",
            }));

            const filledFields = Object.values(values).filter(Boolean).length;
            updateAnsweredQuestions(2, filledFields);

            const isFormComplete = filledFields === 6;
            setSecurityQuestionFormCompleted(isFormComplete);

            // Update the opacity and completion status based on question and answer completeness
            setIsCompleted([
                !!values.question1 && (values.answer1?.length ?? 0) > 0, // Use nullish coalescing to safely check length
                !!values.question2 && (values.answer2?.length ?? 0) > 0,
                !!values.question3 && (values.answer3?.length ?? 0) > 0,
            ]);

            // Scroll to the next question when an answer is provided
            if (filledFields % 2 === 0 && filledFields < 6) {
                questionRefs[filledFields / 2]?.current?.scrollIntoView({ behavior: "smooth" });
            }
        });

        return () => subscription.unsubscribe();
    }, [form, setFormData, updateAnsweredQuestions, setSecurityQuestionFormCompleted, questionRefs]);

    return (
        <div className="w-full max-w-md mx-auto p-8">
            <FormProvider {...form}>
                <form className="space-y-8 w-full"> {/* Ensure form takes up full width */}
                    {[1, 2, 3].map((num, index) => (
                        <Card
                            key={num}
                            ref={questionRefs[index]}
                            className={`p-6 transition-shadow duration-300 ${
                                isCompleted[index] ? "opacity-100 shadow-lg border-orange-500" : "opacity-50 border-yellow-50"
                            } bg-white`}
                            style={{ marginBottom: "24px" }} // Add more space between cards
                        >
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Security Question {num}</h2>

                                <SingleChoiceFormField
                                    fieldName={`question${num}`}
                                    fieldLabel={`Select a security question`}
                                    choices={securityQuestions} // Use securityQuestions as options
                                />

                                <TextFormField
                                    fieldName={`answer${num}`}
                                    fieldLabel={`Your Answer`}
                                    id={`answer${num}`}
                                    autoComplete="off"
                                />
                            </div>
                        </Card>
                    ))}
                </form>
            </FormProvider>
        </div>
    );
};

export default SecurityQuestionsForm;