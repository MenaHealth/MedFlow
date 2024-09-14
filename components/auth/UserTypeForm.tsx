import React, { useEffect, useState } from 'react';
import { useSignupContext } from './SignupContext';
import { RadioCard } from '@/components/ui/radio-card';
import Flex from "@/components/ui/flex";
import Text from "@/components/ui/text";

const UserTypeForm = () => {
    const {
        setAccountType,
        setIsFormComplete,
        formData,
        setFormData,
    } = useSignupContext();

    const [selectedType, setSelectedType] = useState<'Doctor' | 'Triage' | null>(formData.accountType || null);

    useEffect(() => {
        setIsFormComplete(selectedType !== null);
    }, [selectedType, setIsFormComplete]);

    const handleSelectAccountType = (accountType: 'Doctor' | 'Triage') => {
        setSelectedType(accountType);
        setAccountType(accountType);
        setFormData((prevData) => ({ ...prevData, accountType }));
    };

    return (
        <div className="flex justify-center items-center h-full p-4 bg-gray-100 rounded-lg shadow-md">
            <RadioCard.Root
                value={selectedType}
                onValueChange={(value) => handleSelectAccountType(value as 'Doctor' | 'Triage')}
                className="flex w-full justify-center"
            >
                <RadioCard.Item value="Doctor" className="w-1/2 p-2">
                    <Flex direction="column" width="100%" className="justify-center items-center h-full">
                        <Text size="sm" weight="normal">Doctor</Text>
                    </Flex>
                </RadioCard.Item>
                <RadioCard.Item value="Triage" className="w-1/2 p-2">
                    <Flex direction="column" width="100%" className="justify-center items-center h-full">
                        <Text size="sm" weight="normal">Triage</Text>
                    </Flex>
                </RadioCard.Item>
            </RadioCard.Root>
        </div>
    );
};

export default UserTypeForm;