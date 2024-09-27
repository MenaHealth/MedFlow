// utils/securityQuestions.enum.ts
export enum SecurityQuestion {
    MOTHERS_MAIDEN_NAME = 'What is your mother\'s maiden name?',
    FIRST_PET_NAME = 'What was your first pet\'s name?',
    FIRST_SCHOOL_NAME = 'What was the name of your first school?',
    FAVORITE_BOOK = 'What is your favorite book?',
    FAVORITE_MOVIE = 'What is your favorite movie?',
    FAVORITE_FOOD = 'What is your favorite food?',
    BIRTH_CITY = 'What city were you born in?',
    FATHERS_MIDDLE_NAME = 'What is your father\'s middle name?',
    FIRST_CAR = 'What was your first car?',
}

export const securityQuestions = Object.values(SecurityQuestion);