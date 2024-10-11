export const Pharmacies = [
    'EGH, Khan Younis',
    'Shuhada Al Aqsa, Dier El Balah',
    'Abu Yousif Najjar, Rafah',
    'Al Emarati, Rafah',
    'Tal Sultan, Rafah',
    'Kuwaiti Hospital, Rafah',
    'Jordanian Field Hospital, Khan Younis',
    'Nusseirat, Al Awda',
] as const;

export type Pharmacy = typeof Pharmacies[number];