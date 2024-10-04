// utils/countries.enum.ts
export enum Countries {
    EGYPT = 'Egypt',
    PALESTINE_WEST_BANK = 'Palestine - West Bank',
    SYRIA = 'Syria',
    YEMEN = 'Yemen',
    AFGHANISTAN = 'Afghanistan',
    LEBANON = 'Lebanon'
}

export const CountriesList = Object.values(Countries);

export enum CountriesArabic {
    EGYPT = 'مصر',
    PALESTINE_WEST_BANK = 'فلسطين - الضفة الغربية',
    SYRIA = 'سوريا',
    YEMEN = 'اليمن',
    AFGHANISTAN = 'أفغانستان',
    LEBANON = 'لبنان'
}

export const CountriesListArabic = Object.values(CountriesArabic);

export enum CountriesFarsi {
    EGYPT = 'مصر',
    PALESTINE_WEST_BANK = 'فلسطین - کرانه باختری',
    SYRIA = 'سوریه',
    YEMEN = 'یمن',
    AFGHANISTAN = 'افغانستان',
    LEBANON = 'لبنان'
}

export const CountriesListFarsi = Object.values(CountriesFarsi)

export enum CountriesPashto {
    EGYPT = 'مصر',
    PALESTINE_WEST_BANK = 'فلسطین - لویدیځه غاړه',
    SYRIA = 'سوریه',
    YEMEN = 'یمن',
    AFGHANISTAN = 'افغانستان',
    LEBANON = 'لبنان'
}

export const CountriesListPashto = Object.values(CountriesPashto)