// utils/telegram/patientSignupLink.ts

export const signupMessages = {
    english: `
Welcome to MENA Health, please use the link below to complete the patient registration form.
`,
    arabic: `
مرحبًا بكم في مينا هيلث، يرجى استخدام الرابط أدناه لاستكمال نموذج تسجيل المريض.
`,
    farsi: `
به MENA Health خوش آمدید، لطفا از لینک زیر برای تکمیل فرم ثبت نام بیمار استفاده کنید.
`,
    pashto: `
د MENA روغتیا ته ښه راغلاست، مهرباني وکړئ د ناروغ د راجستریشن فارم ډکولو لپاره لاندې لینک وکاروئ.
`,
};

export const registrationSubmittedMessages = {
    english: "Thank you for submitting your registration. A member of our team will contact you soon.",
    arabic: "شكراً لتقديم التسجيل الخاص بك. سيتواصل معك أحد أعضاء فريقنا قريبًا.",
    farsi: "با تشکر از ثبت نام شما. یکی از اعضای تیم ما به زودی با شما تماس خواهد گرفت.",
    pashto: "ستاسو د راجستریشن د وړاندې کولو څخه مننه. زموږ د ټیم یو غړی به ژر تاسو سره اړیکه ونیسي.",
};

// Explicitly type the keys of the signupMessages object
type LanguageKeys = keyof typeof signupMessages;

// Function to get patient signup message
export function getPatientSignupMessage(language: string, link: string): string {
    // Normalize the language to lowercase
    const normalizedLanguage = language.toLowerCase();

    // Check if the normalized language is a valid key
    if (normalizedLanguage in signupMessages) {
        const message = signupMessages[normalizedLanguage as LanguageKeys];
        return `${message}\n\n${link}`;
    }

    // Fallback to English
    console.warn(`Language not found: "${language}". Falling back to English.`);
    return `${signupMessages.english}\n\n${link}`;
}