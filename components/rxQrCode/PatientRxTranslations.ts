// components/rxQrCode/PatientRxTranslations.ts

export enum Language {
    English = 'en',
    Arabic = 'ar',
    Pashto = 'ps',
    Farsi = 'fa',
}

export type TranslationKey =
    | 'prescriptionDetails'
    | 'rxOrderCompleted'
    | 'contactDoctorRefill'
    | 'expandQrCode'
    | 'qrCode'
    | 'scanQrCode'
    | 'qrCodeNotAvailable'
    | 'diagnosis'
    | 'prescriptions'
    | 'orderDetails'
    | 'patientInformation'
    | 'doctorInformation'
    | 'name'
    | 'dateOfBirth'
    | 'country'
    | 'city'
    | 'doctorSpecialty'
    | 'prescribingDoctor'
    | 'prescribedDate'
    | 'validTill'
    | 'rxStatus'
    | 'notSpecified'
    | 'loading'
    | 'error'
    | 'noPrescriptionFound'
    | 'selectLanguage'
    | 'patientAndDoctorInfo'
    | 'close'
    | 'english'
    | 'arabic'
    | 'pashto'
    | 'farsi';

export type Translations = Record<Language, Record<TranslationKey, string>>;

export const translations: Translations = {
    [Language.English]: {
        prescriptionDetails: 'Prescription Details',
        rxOrderCompleted: 'RX Order Completed',
        contactDoctorRefill: 'Please contact your doctor to refill your prescription.',
        expandQrCode: 'Expand QR Code',
        qrCode: 'QR Code',
        scanQrCode: 'Scan this QR code for your RX Order',
        qrCodeNotAvailable: 'QR Code not available',
        diagnosis: 'Diagnosis',
        prescriptions: 'Prescriptions',
        orderDetails: 'Order Details',
        patientInformation: 'Patient Information',
        doctorInformation: 'Doctor Information',
        name: 'Name',
        dateOfBirth: 'Date of Birth',
        country: 'Country',
        city: 'City',
        doctorSpecialty: 'Doctor Specialty',
        prescribingDoctor: 'Prescribing Doctor',
        prescribedDate: 'Prescribed Date',
        validTill: 'Valid Till',
        rxStatus: 'RX Status',
        notSpecified: 'Not specified',
        loading: 'Loading...',
        error: 'Error',
        noPrescriptionFound: 'No prescription found',
        selectLanguage: 'Select Language',
        patientAndDoctorInfo: 'Patient and Doctor Information',
        close: 'Close',
        english: 'English',
        arabic: 'Arabic',
        pashto: 'Pashto',
        farsi: 'Farsi',
    },
    [Language.Arabic]: {
        prescriptionDetails: 'تفاصيل الوصفة الطبية',
        rxOrderCompleted: 'اكتمل طلب الوصفة الطبية',
        contactDoctorRefill: 'يرجى الاتصال بطبيبك لإعادة ملء الوصفة الطبية.',
        expandQrCode: 'توسيع رمز الاستجابة السريعة',
        qrCode: 'رمز الاستجابة السريعة',
        scanQrCode: 'امسح رمز الاستجابة السريعة هذا لطلب الوصفة الطبية الخاص بك',
        qrCodeNotAvailable: 'رمز الاستجابة السريعة غير متوفر',
        diagnosis: 'التشخيص',
        prescriptions: 'الوصفات الطبية',
        orderDetails: 'تفاصيل الطلب',
        patientInformation: 'معلومات المريض',
        doctorInformation: 'معلومات الطبيب',
        name: 'الاسم',
        dateOfBirth: 'تاريخ الميلاد',
        country: 'البلد',
        city: 'المدينة',
        doctorSpecialty: 'تخصص الطبيب',
        prescribingDoctor: 'الطبيب الواصف',
        prescribedDate: 'تاريخ الوصف',
        validTill: 'صالح حتى',
        rxStatus: 'حالة الوصفة الطبية',
        notSpecified: 'غير محدد',
        loading: 'جاري التحميل...',
        error: 'خطأ',
        noPrescriptionFound: 'لم يتم العثور على وصفة طبية',
        selectLanguage: 'اختر اللغة',
        patientAndDoctorInfo: 'معلومات المريض والطبيب',
        close: 'إغلاق',
        english: 'English',
        arabic: 'العربية',
        pashto: 'پښتو',
        farsi: 'فارسی',
    },
    [Language.Pashto]: {
        prescriptionDetails: 'د نسخه توضیحات',
        rxOrderCompleted: 'نسخه بشپړه شوه',
        contactDoctorRefill: 'مهرباني وکړئ د خپلې نسخې ډکولو لپاره له خپل ډاکټر سره اړیکه ونیسئ.',
        expandQrCode: 'QR کوډ پراخول',
        qrCode: 'QR کوډ',
        scanQrCode: 'دا QR کوډ سکین کړئ د خپلې نسخې لپاره',
        qrCodeNotAvailable: 'QR کوډ شتون نلري',
        diagnosis: 'تشخیص',
        prescriptions: 'نسخې',
        orderDetails: 'د امر تفصیلات',
        patientInformation: 'د ناروغ معلومات',
        doctorInformation: 'د ډاکټر معلومات',
        name: 'نوم',
        dateOfBirth: 'د زیږیدنې نیټه',
        country: 'هېواد',
        city: 'ښار',
        doctorSpecialty: 'د ډاکټر تخصص',
        prescribingDoctor: 'نسخه لیکونکی ډاکټر',
        prescribedDate: 'نسخه شوې نیټه',
        validTill: 'د اعتبار نیټه',
        rxStatus: 'د نسخې حالت',
        notSpecified: 'نه دی مشخص شوی',
        loading: 'بار کول...',
        error: 'تېروتنه',
        noPrescriptionFound: 'هیڅ نسخه ونه موندل شوه',
        selectLanguage: 'ژبه وټاکئ',
        patientAndDoctorInfo: 'د ناروغ او ډاکټر معلومات',
        close: 'بند کړئ',
        english: 'English',
        arabic: 'عربي',
        pashto: 'پښتو',
        farsi: 'فارسی',
    },
    [Language.Farsi]: {
        prescriptionDetails: 'جزئیات نسخه',
        rxOrderCompleted: 'نسخه تکمیل شد',
        contactDoctorRefill: 'لطفاً برای تمدید نسخه با پزشک خود تماس بگیرید.',
        expandQrCode: 'گسترش کد QR',
        qrCode: 'کد QR',
        scanQrCode: 'این کد QR را برای نسخه خود اسکن کنید',
        qrCodeNotAvailable: 'کد QR موجود نیست',
        diagnosis: 'تشخیص',
        prescriptions: 'نسخه‌ها',
        orderDetails: 'جزئیات سفارش',
        patientInformation: 'اطلاعات بیمار',
        doctorInformation: 'اطلاعات پزشک',
        name: 'نام',
        dateOfBirth: 'تاریخ تولد',
        country: 'کشور',
        city: 'شهر',
        doctorSpecialty: 'تخصص پزشک',
        prescribingDoctor: 'پزشک تجویز کننده',
        prescribedDate: 'تاریخ تجویز',
        validTill: 'معتبر تا',
        rxStatus: 'وضعیت نسخه',
        notSpecified: 'مشخص نشده',
        loading: 'در حال بارگذاری...',
        error: 'خطا',
        noPrescriptionFound: 'نسخه‌ای یافت نشد',
        selectLanguage: 'انتخاب زبان',
        patientAndDoctorInfo: 'اطلاعات بیمار و پزشک',
        close: 'بستن',
        english: 'English',
        arabic: 'عربی',
        pashto: 'پشتو',
        farsi: 'فارسی',
    },
};