import React from 'react';
import { useSignupContext } from './SignupContext';
import { RadioCard } from '@/components/ui/radio-card';
import Flex from "@/components/ui/flex";
import Text from "@/components/ui/text";

const UserTypeForm = () => {
    const { setAccountType, setFormData, accountType, updateAnsweredQuestions } = useSignupContext();

    const handleSelectAccountType = (selectedType: 'Doctor' | 'Triage') => {
        setAccountType(selectedType);
        setFormData((prevData) => ({ ...prevData, accountType: selectedType }));

        // Call updateAnsweredQuestions with step 0 (for UserTypeForm)
        updateAnsweredQuestions(0, selectedType ? 1 : 0); // 1 if selected, 0 if not
    };

    return (
        <div className="flex justify-center items-center h-full p-4 bg-gray-100 rounded-lg shadow-md">
            <RadioCard.Root value={accountType ?? undefined} onValueChange={handleSelectAccountType} className="flex w-full h-full justify-center space-x-4">
                <RadioCard.Item value="Doctor" className="flex-grow p-4 h-full">
                    <Flex direction="column" width="100%" className="justify-center items-center h-full">
                        <Text size="sm" weight="normal">Doctor</Text>
                    </Flex>
                </RadioCard.Item>
                <RadioCard.Item value="Triage" className="flex-grow p-4 h-full">
                    <Flex direction="column" width="100%" className="justify-center items-center h-full">
                        <Text size="sm" weight="normal">Triage</Text>
                    </Flex>
                </RadioCard.Item>
            </RadioCard.Root>
        </div>
    );
};

export default UserTypeForm;