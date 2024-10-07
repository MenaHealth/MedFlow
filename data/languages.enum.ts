// utils/languages.enum.ts
export enum Languages {
    ENGLISH = 'English',
    ARABIC = 'Arabic',
    FARSI = 'Farsi',
    PASHTO = 'Pashto',
    TURKISH = 'Turkish',
    URDU = 'Urdu',
    SPANISH = 'Spanish',
    FRENCH = 'French',
}

export const LanguagesList = Object.values(Languages);

export enum LanguagesArabic {
    ARABIC = 'العربية',
    FARSI = 'الفارسية',
    PASHTO = 'البشتو',
    ENGLISH = 'إنجليزي',
    TURKISH = 'تركي',
    URDU = 'الأردية',
    SPANISH = 'الأسبانية',
    FRENCH = 'فرنسي',
}

export const LanguagesListArabic = Object.values(LanguagesArabic);

export enum LanguagesFarsi {
    FARSI = 'فارسی',
    ARABIC = 'عربی',
    PASHTO = 'پشتو',
    ENGLISH = 'انگلیسی',
    TURKISH = 'ترکی',
    URDU = 'اردو',
    SPANISH = 'اسپانیایی',
    FRENCH = 'فرانسوی',
}

export const LanguagesListFarsi = Object.values(LanguagesFarsi)

export enum LanguagesPashto {
    PASHTO = 'پښتو',
    ARABIC = 'عربي',
    FARSI = 'فارسي',
    ENGLISH = 'انګلیسي',
    TURKISH = 'ترکي',
    URDU = 'اردو',
    SPANISH = 'هسپانیه ایی',
    FRENCH = 'فرانسوي',
}

export const LanguagesListPashto = Object.values(LanguagesPashto)