// components/newPatient/aboutPage/NewPatientTranslations.ts
interface Step {
    title: string;
    description: string;
}

export interface TranslationContent {
    title: string;
    subtitle: string;
    steps: Step[];
    getStarted: string;
    buttonText: string;
    helpText: string;
    contactInfo: string;
    telegramLink: string;
}

interface Translations {
    english: TranslationContent;
    arabic: TranslationContent;
    pashto: TranslationContent;
    farsi: TranslationContent;
}

export const newPatientTranslations: Translations = {
    english: {
        title: "New Patient Registration",
        subtitle: "If you are a patient who needs a medical consultation and would like to register for our free telehealth app, MedFlow, please follow the steps below:",
        steps: [
            {
                title: "Click the Button Below to Chat with Our MENA Health Telegram chat bot",
                description: "Connect with our team on Telegram. This ensures flexible, quick, and easy communication.",
            },
            {
                title: "Send Us a Message",
                description: "Once you click the button, you'll be redirected to our Telegram chat. Send us a text to start, and you will receive a link to our patient registration form.",
            },
            {
                title: "Complete Your Registration",
                description: "Once you've submitted your registration form, you will receive a confirmation text and a member of our medical team will reach out to you!",
            },
        ],
        getStarted: "Ready to Get Started?",
        buttonText: "Chat with Our Team on Telegram",
        helpText: "Need Help?",
        contactInfo: "If you have any issues or need further assistance, send us an email at Contactus@menahealth.org or send us a message on Instagram @themenahealth.",
        telegramLink: "https://t.me/menahealth_bot",
    },
    arabic: {
        title: "تسجيل المرضى الجدد",
        subtitle: "إذا كنت مريضًا وتحتاج إلى استشارة طبية وتود التسجيل في تطبيق MedFlow الصحي المجاني، يرجى اتباع الخطوات التالية:",
        steps: [
            {
                title: "اضغط على الزر أدناه للدردشة مع بوت تليجرام الخاص بـ MENA Health",
                description: "تواصل مع فريقنا على تليجرام لضمان تواصل مرن وسريع وسهل.",
            },
            {
                title: "أرسل لنا رسالة",
                description: "عند الضغط على الزر، سيتم توجيهك إلى دردشة تليجرام. أرسل رسالة نصية للبدء وستتلقى رابطًا لنموذج تسجيل المرضى.",
            },
            {
                title: "أكمل تسجيلك",
                description: "بمجرد تقديم نموذج التسجيل الخاص بك، ستتلقى رسالة تأكيد وسيقوم أحد أفراد فريقنا الطبي بالتواصل معك!",
            },
        ],
        getStarted: "هل أنت مستعد للبدء؟",
        buttonText: "تواصل مع فريقنا على تليجرام",
        helpText: "تحتاج مساعدة؟",
        contactInfo: "إذا واجهت أي مشكلات أو كنت بحاجة إلى مساعدة إضافية، يرجى إرسال بريد إلكتروني إلى Contactus@menahealth.org أو رسالة على إنستغرام @themenahealth.",
        telegramLink: "https://t.me/menahealth_bot",
    },
    pashto: {
        title: "د نوي ناروغ ثبت کول",
        subtitle: "که تاسو ناروغ یاست چې طبي مشورې ته اړتیا لرئ او زموږ د وړیا تلیفون روغتیايي ایپ، MedFlow کې ثبت کول غواړئ، لاندې مرحلې تعقیب کړئ:",
        steps: [
            {
                title: "لاندې تڼۍ کېکاږئ ترڅو زموږ د MENA Health ټلیګرام چټ بوټ سره خبرې وکړئ",
                description: "زموږ له ټیم سره په ټلیګرام اړیکه ونیسئ. دا د انعطاف وړ، چټک، او اسانه اړیکې ډاډ ورکوي.",
            },
            {
                title: "موږ ته یو پیغام واستوئ",
                description: "کله چې تاسو په تڼۍ کلیک وکړئ، تاسو به زموږ ټلیګرام چټ ته واستول شئ. د پیل لپاره موږ ته یو متن ولیکئ، او تاسو ته به زموږ د ناروغ ثبت فورم لپاره یو لینک واستول شي.",
            },
            {
                title: "خپله ثبت بشپړ کړئ",
                description: "کله چې تاسو د ثبت فورمه وسپارئ، تاسو ته به د تایید پیغام ترلاسه کړئ او زموږ د طبي ټیم غړی به تاسو سره اړیکه ونیسي!",
            },
        ],
        getStarted: "د پیل لپاره چمتو یاست؟",
        buttonText: "زموږ ټیم سره په ټلیګرام خبرې وکړئ",
        helpText: "مرستې ته اړتیا لرئ؟",
        contactInfo: "که تاسو کومه ستونزه لرئ یا اضافي مرستې ته اړتیا لرئ، موږ ته په Contactus@menahealth.org بریښنالیک واستوئ یا زموږ انسټاګرام کې پیغام ولیکئ @themenahealth.",
        telegramLink: "https://t.me/menahealth_bot",
    },
    farsi: {
        title: "ثبت نام بیمار جدید",
        subtitle: "اگر بیمار هستید و نیاز به مشاوره پزشکی دارید و می‌خواهید برای اپلیکیشن رایگان MedFlow ثبت نام کنید، لطفاً مراحل زیر را دنبال کنید:",
        steps: [
            {
                title: "بر روی دکمه زیر کلیک کنید تا با ربات تلگرام MENA Health گفتگو کنید",
                description: "با تیم ما در تلگرام ارتباط برقرار کنید. این امر ارتباط آسان، سریع و منعطف را تضمین می‌کند.",
            },
            {
                title: "برای ما پیامی ارسال کنید",
                description: "پس از کلیک بر روی دکمه، به چت تلگرام ما هدایت می‌شوید. برای شروع به ما پیامی ارسال کنید و لینک فرم ثبت نام بیمار را دریافت کنید.",
            },
            {
                title: "ثبت نام خود را کامل کنید",
                description: "پس از ارسال فرم ثبت نام خود، یک پیام تأیید دریافت خواهید کرد و یکی از اعضای تیم پزشکی ما با شما تماس خواهد گرفت!",
            },
        ],
        getStarted: "آماده شروع هستید؟",
        buttonText: "با تیم ما در تلگرام گفتگو کنید",
        helpText: "نیاز به کمک دارید؟",
        contactInfo: "اگر مشکلی دارید یا به کمک بیشتری نیاز دارید، لطفاً یک ایمیل به Contactus@menahealth.org ارسال کنید یا به ما در اینستاگرام پیام دهید @themenahealth.",
        telegramLink: "https://t.me/menahealth_bot",
    },
};