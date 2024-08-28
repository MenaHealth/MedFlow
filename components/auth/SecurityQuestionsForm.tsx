// components/auth/SecurityQuestionsForm.tsx
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdownMenu";
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { securityQuestions } from "@/utils/securityQuestions.enum";
import { PaperPlaneIcon, ResetIcon } from "@radix-ui/react-icons";
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
    onSubmit: (data: { securityQuestions: Array<{ question: string, answer: string }> }) => void;
    onBack: () => void;
}

const SecurityQuestionsForm = ({ onSubmit, onBack }: Props) => {
    const { setToast } = useToast();
    const form = useForm<SecurityQuestionsFormValues>({
        resolver: zodResolver(securityQuestionsSchema),
        defaultValues: {
            question1: '',
            answer1: '',
            question2: '',
            answer2: '',
            question3: '',
            answer3: '',
        },
    });

    const handleSubmit = (data: SecurityQuestionsFormValues) => {
        const formattedData = {
            securityQuestions: [
                { question: data.question1, answer: data.answer1 },
                { question: data.question2, answer: data.answer2 },
                { question: data.question3, answer: data.answer3 },
            ]
        };
        onSubmit(formattedData);
    };

    const selectedQuestions = [form.getValues('question1'), form.getValues('question2'), form.getValues('question3')];

    const allFieldsFilled = Object.values(form.watch()).every(value => value);

    const handleError = () => {
        setToast({
            title: "Error",
            description: "Security questions are required",
            variant: "destructive",
        });
    };

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-4">
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full">
                            <TextFormField
                                form={form}
                                fieldName="question1"
                                fieldLabel="Security Question 1"
                                className="w-full"
                                disabled
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {securityQuestions.filter(question => !selectedQuestions.includes(question) || question === form.getValues('question1')).map((question, index) => (
                                <DropdownMenuItem key={index} onSelect={() => form.setValue('question1', question)}>{question}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TextFormField
                        form={form}
                        fieldName="answer1"
                        fieldLabel="Your Answer"
                    />
                </div>

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full">
                            <TextFormField
                                form={form}
                                fieldName="question2"
                                fieldLabel="Security Question 2"
                                className="w-full"
                                disabled
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {securityQuestions.filter(question => !selectedQuestions.includes(question) || question === form.getValues('question2')).map((question, index) => (
                                <DropdownMenuItem key={index} onSelect={() => form.setValue('question2', question)}>{question}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TextFormField
                        form={form}
                        fieldName="answer2"
                        fieldLabel="Your Answer"
                    />
                </div>

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full">
                            <TextFormField
                                form={form}
                                fieldName="question3"
                                fieldLabel="Security Question 3"
                                className="w-full"
                                disabled
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {securityQuestions.filter(question => !selectedQuestions.includes(question) || question === form.getValues('question3')).map((question, index) => (
                                <DropdownMenuItem key={index} onSelect={() => form.setValue('question3', question)}>{question}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TextFormField
                        form={form}
                        fieldName="answer3"
                        fieldLabel="Your Answer"
                    />
                </div>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        onClick={onBack}
                        className="w-full mr-2 flex items-center justify-center"
                    >
                        <ResetIcon className="h-5 w-5" />
                        {/*<span className="ml-2">Back</span>*/}
                    </Button>
                    <Button
                        type="submit"
                        className={`w-full flex items-center justify-center 
                        ${allFieldsFilled ? 'bg-orange hover:bg-lightOrange' : 'bg-gray hover:bg-darkGrey'}`}
                    >
                        <PaperPlaneIcon className={`h-6 w-6 ${allFieldsFilled ? 'text-[var(--orange)]' : 'text-black'}`} />
                        <span className="ml-2">Submit</span>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SecurityQuestionsForm;