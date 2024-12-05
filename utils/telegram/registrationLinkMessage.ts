import { Languages } from "@/data/languages.enum";

const registrationLinkMessages: Record<Languages, string> = {
    [Languages.ENGLISH]: "Welcome to MENA Health, please use the link below to complete the patient registration form.",
    [Languages.ARABIC]: "مرحبًا بكم في مينا هيلث، يرجى استخدام الرابط أدناه لاستكمال نموذج تسجيل المريض.",
    [Languages.FARSI]: "به MENA Health خوش آمدید، لطفا از لینک زیر برای تکمیل فرم ثبت نام بیمار استفاده کنید.",
    [Languages.PASHTO]: "د MENA روغتیا ته ښه راغلاست، مهرباني وکړئ د ناروغ د راجستریشن فارم ډکولو لپاره لاندې لینک وکاروئ.",
};

export function getRegistrationLinkMessage(language: Languages): string {
    return registrationLinkMessages[language] || registrationLinkMessages[Languages.ENGLISH];
}