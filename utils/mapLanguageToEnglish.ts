import { LanguagesArabic, LanguagesFarsi, LanguagesPashto, Languages } from "@/data/languages.enum";

export const mapLanguageToEnglish = (selectedLanguage: string, userLanguage: string): keyof typeof Languages | undefined => {
    switch (userLanguage) {
        case 'arabic':
            return Object.keys(LanguagesArabic).find(
                key => LanguagesArabic[key as keyof typeof LanguagesArabic] === selectedLanguage
            ) as keyof typeof Languages;
        case 'farsi':
            return Object.keys(LanguagesFarsi).find(
                key => LanguagesFarsi[key as keyof typeof LanguagesFarsi] === selectedLanguage
            ) as keyof typeof Languages;
        case 'pashto':
            return Object.keys(LanguagesPashto).find(
                key => LanguagesPashto[key as keyof typeof LanguagesPashto] === selectedLanguage
            ) as keyof typeof Languages;
        // Add more cases for other languages
        default:
            return undefined; // Return undefined if no match is found
    }
};