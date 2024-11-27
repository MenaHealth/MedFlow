// types/telegramContact.d.ts
export type ImportContactsResponse = {
    users: Array<{
        id: number;
        access_hash: string;
        [key: string]: any;
    }>;
};