// utils/countries.enum.ts
export enum Countries {
    EGYPT = 'Egypt',
    PALESTINE_GAZA = 'Palestine - Gaza',
    PALESTINE_WEST_BANK = 'Palestine - West Bank',
    SYRIA = 'Syria',
    YEMEN = 'Yemen',
    AFGHANISTAN = 'Afghanistan',
    LEBANON = 'Lebanon'
}

export const CountriesList = Object.values(Countries);

export enum CountriesArabic {
    EGYPT = 'مصر',
    PALESTINE_GAZA = 'فلسطين - غزة',
    PALESTINE_WEST_BANK = 'فلسطين - الضفة الغربية',
    SYRIA = 'سوريا',
    YEMEN = 'اليمن',
    AFGHANISTAN = 'أفغانستان',
    LEBANON = 'لبنان'
}

export const CountriesListArabic = Object.values(CountriesArabic);

export enum CountriesFarsi {
    EGYPT = 'مصر',
    PALESTINE_GAZA = 'فلسطین - غزه',
    PALESTINE_WEST_BANK = 'فلسطین - کرانه باختری',
    SYRIA = 'سوریه',
    YEMEN = 'یمن',
    AFGHANISTAN = 'افغانستان',
    LEBANON = 'لبنان'
}

export const CountriesListFarsi = Object.values(CountriesFarsi)

export enum CountriesPashto {
    EGYPT = 'مصر',
    PALESTINE_GAZA = 'فلسطین – غزه',
    PALESTINE_WEST_BANK = 'فلسطین - لویدیځه غاړه',
    SYRIA = 'سوریه',
    YEMEN = 'یمن',
    AFGHANISTAN = 'افغانستان',
    LEBANON = 'لبنان'
}

export const CountriesListPashto = Object.values(CountriesPashto)

export enum CountryCodes {
    EGYPT = '+20',
    AFGHANISTAN = '+93',
    LEBANON = '+961',
    JORDAN = '+962',
    SYRIA = '+963',
    YEMEN = '+967',
    USA = '+1',
    PALESTINE = '+970',
    ISRAEL = '+972',
}

export const CountryCodesList = Object.values(CountryCodes)
