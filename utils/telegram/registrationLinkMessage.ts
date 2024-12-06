import { Languages } from "@/data/languages.enum";

const registrationLinkMessages: Record<Languages, string> = {
    [Languages.ENGLISH]: "Welcome to MENA Health, please use the link below to complete the patient registration form.",
    [Languages.ARABIC]: "مرحبًا بكم في مينا هيلث، يرجى استخدام الرابط أدناه لاستكمال نموذج تسجيل المريض.",
    [Languages.FARSI]: "به MENA Health خوش آمدید، لطفا از لینک زیر برای تکمیل فرم ثبت نام بیمار استفاده کنید.",
    [Languages.PASHTO]: "د MENA روغتیا ته ښه راغلاست، مهرباني وکړئ د ناروغ د راجستریشن فارم ډکولو لپاره لاندې لینک وکاروئ.",
    [Languages.TURKISH]: "MENA Sağlık'a hoş geldiniz, hasta kayıt formunu tamamlamak için aşağıdaki bağlantıyı kullanın.",
    [Languages.URDU]: "MENA Health میں خوش آمدید، براہ کرم مریض رجسٹریشن فارم مکمل کرنے کے لیے نیچے دیے گئے لنک کا استعمال کریں۔",
    [Languages.SPANISH]: "Bienvenido a MENA Health, utilice el enlace a continuación para completar el formulario de registro del paciente.",
    [Languages.FRENCH]: "Bienvenue chez MENA Health, veuillez utiliser le lien ci-dessous pour compléter le formulaire d'inscription du patient.",
};

export function getRegistrationLinkMessage(language: Languages): string {
    return registrationLinkMessages[language] || registrationLinkMessages[Languages.ENGLISH];
}