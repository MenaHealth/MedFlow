// data/languages.enum.ts
export enum Languages {
    ENGLISH = 'English',
    ARABIC = 'Arabic',
    FARSI = 'Farsi',
    PASHTO = 'Pashto',
}

export const LanguagesList = Object.values(Languages);

export enum LanguagesArabic {
    ARABIC = 'العربية',
    FARSI = 'الفارسية',
    PASHTO = 'البشتو',
    ENGLISH = 'إنجليزي',
}

export const LanguagesListArabic = Object.values(LanguagesArabic);

export enum LanguagesFarsi {
    FARSI = 'فارسی',
    ARABIC = 'عربی',
    PASHTO = 'پشتو',
    ENGLISH = 'انگلیسی',
}

export const LanguagesListFarsi = Object.values(LanguagesFarsi)

export enum LanguagesPashto {
    PASHTO = 'پښتو',
    ARABIC = 'عربي',
    FARSI = 'فارسي',
    ENGLISH = 'انګلیسي',
}

export const LanguagesListPashto = Object.values(LanguagesPashto)