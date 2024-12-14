import { CountriesArabic, CountriesFarsi, CountriesPashto, Countries } from "@/data/countries.enum";

export const mapCountryToEnglish = (selectedCountry: string, userLanguage: string): keyof typeof Countries | undefined => {
    switch (userLanguage) {
        case 'arabic':
            return Object.keys(CountriesArabic).find(
                key => CountriesArabic[key as keyof typeof CountriesArabic] === selectedCountry
            ) as keyof typeof Countries;
        case 'farsi':
            return Object.keys(CountriesFarsi).find(
                key => CountriesFarsi[key as keyof typeof CountriesFarsi] === selectedCountry
            ) as keyof typeof Countries;
        case 'pashto':
            return Object.keys(CountriesPashto).find(
                key => CountriesPashto[key as keyof typeof CountriesPashto] === selectedCountry
            ) as keyof typeof Countries;
        // Add more cases for other languages
        default:
            return undefined; // Return undefined if no match is found
    }
};