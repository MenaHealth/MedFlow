import React, { useEffect, useState } from 'react';
import { useSignupContext } from './SignupContext';
import { RadioCard } from '@/components/ui/radio-card';
import Flex from "@/components/ui/flex";
import Text from "@/components/ui/text";

const UserTypeForm = () => {
    const { setAccountType, setFormData, accountType, updateAnsweredQuestions } = useSignupContext();

    useEffect(() => {
        // Avoid unnecessary state updates
        if (accountType) {
            // Call updateAnsweredQuestions once, avoid setting it repeatedly
            updateAnsweredQuestions(0, 1); // 1 if accountType is selected
        } else {
            updateAnsweredQuestions(0, 0); // 0 if no accountType is selected
        }
    }, [accountType, updateAnsweredQuestions]); // Depend only on accountType

    const handleSelectAccountType = (selectedType: 'Doctor' | 'Triage') => {
        if (selectedType !== accountType) {  // Avoid re-setting the same value
            setAccountType(selectedType);
            setFormData((prevData) => ({ ...prevData, accountType: selectedType }));
        }
    };

    return (
        <>
            <h2 className='flex justify-center mb-2'>Choose Account Type:</h2>
            <div className="flex flex-col items-center h-full p-4 rounded-lg shadow-md">
                <RadioCard.Root value={accountType ?? undefined} onValueChange={handleSelectAccountType} className="flex w-full h-6 justify-center space-x-4">
                    <RadioCard.Item value="Doctor" className="flex-grow p-4">
                        <Flex direction="column" width="100%" className="justify-center items-center h-full">
                            <Text size="sm" weight="normal">Doctor</Text>
                        </Flex>
                    </RadioCard.Item>
                    <RadioCard.Item value="Triage" className="flex-grow p-4">
                        <Flex direction="column" width="100%" className="justify-center items-center h-full">
                            <Text size="sm" weight="normal">Triage</Text>
                        </Flex>
                    </RadioCard.Item>
                </RadioCard.Root>
            </div>
        </>
    );
};

export default UserTypeForm;