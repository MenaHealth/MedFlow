// components/rxQrCode/PatientRxView.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePatientViewModel, prescriptionColumns } from './PatientRxViewModel';
import { Language, translations, TranslationKey } from './PatientRxTranslations';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Expand, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu"
import {cn} from "@/lib/utils";

interface QRCodeDisplayProps {
    uuid: string;
}

const PatientRxView: React.FC<QRCodeDisplayProps> = ({ uuid }) => {
    const { rxOrder, loading, error } = usePatientViewModel(uuid);
    const [language, setLanguage] = useState<Language>(Language.English);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);


    const t = (key: TranslationKey) => translations[language][key];

    if (loading) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>{t('loading')}</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    if (error) {
        return (
            <Card
                className="w-full max-w-4xl mx-auto"
                backgroundColor=""
                borderColor="border-orange-500"
                borderSize={1}
                shadowSize="md"
            >
                <CardHeader>
                    <CardTitle>{t('error')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (!rxOrder) {
        return (
            <Card
                className="w-full max-w-4xl mx-auto"
                backgroundColor=""
                borderColor="border-orange-500"
                borderSize={1}
                shadowSize="md"
            >
                <CardHeader>
                    <CardTitle>{t('noPrescriptionFound')}</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card
            className={cn(
                "w-full max-w-4xl mx-auto relative z-10",
                isAccordionOpen ? "mb-72" : "mb-8 mt-16"
            )}
            backgroundOpacity={0}
            borderSize={1}
            shadowSize="md"
        >
            <CardHeader className="flex flex-row items-center justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default">
                            {t('selectLanguage')} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setLanguage(Language.English)}>
                            {t('english')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage(Language.Arabic)}>
                            {t('arabic')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage(Language.Pashto)}>
                            {t('pashto')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage(Language.Farsi)}>
                            {t('farsi')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center space-x-4">
                    <Image
                        src="/assets/images/mena_health_logo.jpeg"
                        alt="Mena Health Logo"
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                    <CardTitle>{t('prescriptionDetails')}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {rxOrder.rxStatus === 'completed' ? (
                    <div className="text-center bg-orange-100 text-orange-800 p-4 rounded-md border border-orange-300">
                        <p className="font-semibold">{t('rxOrderCompleted')}</p>
                        <p>{t('contactDoctorRefill')}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <div className="relative inline-block">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="absolute -top-4 -right-4 bg-white text-orange-500 hover:bg-orange-500 hover:text-white shadow-md rounded-full p-1 z-10"
                                        >
                                            <Expand className="h-4 w-4"/>
                                            <span className="sr-only">{t('expandQrCode')}</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>{t('qrCode')}</DialogTitle>
                                            <DialogDescription>{t('scanQrCode')}</DialogDescription>
                                        </DialogHeader>
                                        <div className="flex items-center justify-center p-6">
                                            {rxOrder.PharmacyQrCode ? (
                                                <Image
                                                    src={rxOrder.PharmacyQrCode}
                                                    alt={t('qrCode')}
                                                    width={300}
                                                    height={300}
                                                    className="max-w-full h-auto"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-[300px] h-[300px] bg-gray-200 text-gray-500">
                                                    {t('qrCodeNotAvailable')}
                                                </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {rxOrder.PharmacyQrCode ? (
                                    <Image
                                        src={rxOrder.PharmacyQrCode}
                                        alt={t('qrCode')}
                                        width={200}
                                        height={200}
                                        className="border rounded-lg shadow-md"
                                    />
                                ) : (
                                    <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-200 text-gray-500 border rounded-lg shadow-md">
                                        {t('qrCodeNotAvailable')}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {rxOrder.prescriptions.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{t('diagnosis')}</h3>
                                    <div className="border-gray-300 p-2 rounded-md border">
                                        <p>{rxOrder.prescriptions[0].diagnosis}</p>
                                    </div>
                                </div>
                            )}
                            <h3 className="text-lg font-semibold mb-2">{t('prescriptions')}</h3>
                            <Table
                                data={rxOrder.prescriptions.map(({diagnosis, ...rest}) => rest)}
                                columns={prescriptionColumns}
                                backgroundColor="bg-white"
                                textColor="text-gray-900"
                                borderColor="border-gray-200"
                                headerBackgroundColor="bg-gray-100"
                                headerTextColor="text-gray-700"
                                hoverBackgroundColor="hover:bg-gray-50"
                                hoverTextColor="hover:text-gray-900"
                            />
                        </div>

                        <Accordion
                            type="single"
                            collapsible
                            className="w-full bg-darkBlue text-white rounded-2xl px-4"
                            onValueChange={(value) => setIsAccordionOpen(!!value)}
                        >
                            <AccordionItem value="order-details">
                                <AccordionTrigger className="justify-center text-center">
                                    {t('orderDetails')}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-lg">{t('patientInformation')}</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('name')}</h5>
                                                    <p>{rxOrder.patientName || t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('dateOfBirth')}</h5>
                                                    <p>{rxOrder.patientDob ? new Date(rxOrder.patientDob).toLocaleDateString() : t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('country')}</h5>
                                                    <p>{rxOrder.patientCountry || t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('city')}</h5>
                                                    <p>{rxOrder.patientCity || t('notSpecified')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-lg">{t('doctorInformation')}</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('doctorSpecialty')}</h5>
                                                    <p>{rxOrder.doctorSpecialty || t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('prescribingDoctor')}</h5>
                                                    <p>{rxOrder.prescribingDr || t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('prescribedDate')}</h5>
                                                    <p>{rxOrder.prescribedDate ? new Date(rxOrder.prescribedDate).toLocaleDateString() : t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('validTill')}</h5>
                                                    <p>{rxOrder.validTill ? new Date(rxOrder.validTill).toLocaleDateString() : t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('city')}</h5>
                                                    <p>{rxOrder.city || t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold border-b pb-1">{t('rxStatus')}</h5>
                                                    <p>{rxOrder.rxStatus || t('notSpecified')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default PatientRxView;


