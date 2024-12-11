// utils/telegram/postRegistrationConfirmation.ts

// Translations for the registration confirmation message
const registrationMessages = {
    english: `
You have successfully submitted your patient registration to MENA Health. A member of our medical team will contact you as soon as possible.
`,
    arabic: `
لقد قمت بتقديم تسجيلك كمريض بنجاح إلى مينا هيلث، وسيقوم أحد أعضاء فريقنا الطبي بالتواصل معك في أقرب وقت ممكن.
`,
    farsi: `
شما با موفقیت ثبت نام بیمار خود را به MENA Health ارسال کردید، یکی از اعضای تیم پزشکی ما در اسرع وقت با شما تماس خواهد گرفت.
`,
    pashto: `
تاسو په بریالیتوب سره د خپل ناروغ راجستریشن MENA روغتیا ته سپارلی، زموږ د طبي ټیم غړی به څومره ژر چې امکان ولري تاسو سره اړیکه ونیسي.
`,
};

// Function to get the registration message based on the selected language
export function getRegistrationMessage(language: string): string {
    switch (language.toLowerCase()) {
        case "arabic":
            return registrationMessages.arabic;
        case "farsi":
            return registrationMessages.farsi;
        case "pashto":
            return registrationMessages.pashto;
        default:
            return registrationMessages.english; // Default to English
    }
}