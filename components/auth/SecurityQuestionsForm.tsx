import React, { useEffect, useState, useRef, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { securityQuestions } from "@/utils/securityQuestions.enum";
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
    const [filteredQuestions, setFilteredQuestions] = useState({
        question1: securityQuestions,
        question2: securityQuestions,
        question3: securityQuestions,
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            const { question1, question2, question3 } = values;

            // Update form data
            setFormData((prevData) => ({
                ...prevData,
                question1,
                answer1: values.answer1 || "",
                question2,
                answer2: values.answer2 || "",
                question3,
                answer3: values.answer3 || "",
            }));

            const filledFields = Object.values(values).filter(Boolean).length;
            updateAnsweredQuestions(2, filledFields);

            const isFormComplete = filledFields === 6;
            setSecurityQuestionFormCompleted(isFormComplete);

            // Dynamically filter the questions to prevent duplicates
            const availableForQ2 = securityQuestions.filter(q => q !== question1);
            const availableForQ3 = securityQuestions.filter(q => q !== question1 && q !== question2);

            setFilteredQuestions({
                question1: securityQuestions,
                question2: availableForQ2,
                question3: availableForQ3,
            });

            // Update the opacity and completion status based on question and answer completeness
            setIsCompleted([
                !!values.question1 && (values.answer1?.length ?? 0) > 0,
                !!values.question2 && (values.answer2?.length ?? 0) > 0,
                !!values.question3 && (values.answer3?.length ?? 0) > 0,
            ]);
        });

        return () => subscription.unsubscribe();
    }, [form, setFormData, updateAnsweredQuestions, setSecurityQuestionFormCompleted]);

    const handleBlur = (index: number) => {
        if (isCompleted[index] && index < 2) {
            questionRefs[index + 1]?.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8">
            <FormProvider {...form}>
                <form className="space-y-8 w-full">
                    {[1, 2, 3].map((num, index) => (
                        <Card
                            key={num}
                            ref={questionRefs[index]}
                            className={`p-6 transition-shadow duration-300 ${
                                isCompleted[index] ? "opacity-100 shadow-lg border-orange-500" : "opacity-50 border-yellow-50"
                            } bg-white`}
                            style={{ marginBottom: "24px" }}
                        >
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Security Question {num}</h2>

                                <SingleChoiceFormField
                                    fieldName={`question${num}`}
                                    choices={filteredQuestions[`question${num}`]} // Use filtered questions
                                />

                                <TextFormField
                                    fieldName={`answer${num}`}
                                    fieldLabel={`Your Answer`}
                                    id={`answer${num}`}
                                    autoComplete="off"
                                    onBlur={() => handleBlur(index)} // Trigger scroll on blur
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