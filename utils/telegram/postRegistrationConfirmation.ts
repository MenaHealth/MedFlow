// utils/telegram/postRegistrationConfirmation.ts

// Translations for the registration confirmation message
const registrationMessages = {
    english: `
You have successfully submitted your patient registration to MENA Health. A member of our medical team will contact you as soon as possible.
If you have not received a message from us in the next 24 hours, or if your medical condition has worsened, please let us know by sending the number “9”.
`,
    arabic: `
لقد قمت بتقديم تسجيلك كمريض بنجاح إلى مينا هيلث، وسيقوم أحد أعضاء فريقنا الطبي بالتواصل معك في أقرب وقت ممكن.
إذا لم تتلق رسالة منا خلال الـ 24 ساعة القادمة، أو إذا ساءت حالتك الطبية، يرجى إخبارنا عن طريق إرسال الرقم "9".
`,
    farsi: `
شما با موفقیت ثبت نام بیمار خود را به MENA Health ارسال کردید، یکی از اعضای تیم پزشکی ما در اسرع وقت با شما تماس خواهد گرفت.
اگر در 24 ساعت آینده پیامی از ما دریافت نکردید، یا اگر وضعیت پزشکی شما بدتر شده است، لطفا با ارسال شماره "9" به ما اطلاع دهید.
`,
    pashto: `
تاسو په بریالیتوب سره د خپل ناروغ راجستریشن MENA روغتیا ته سپارلی، زموږ د طبي ټیم غړی به څومره ژر چې امکان ولري تاسو سره اړیکه ونیسي.
که تاسو په راتلونکو 24 ساعتونو کې زموږ لخوا پیغام نه وي ترلاسه کړی، یا که ستاسو روغتیایی حالت خراب شوی وي نو مهرباني وکړئ موږ ته د "9" شمیرې په لیږلو خبر راکړئ.
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