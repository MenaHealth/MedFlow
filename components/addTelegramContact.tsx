// components/addTelegramContact.tsx

import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { Api } from "telegram";
import { IPatient } from "@/models/patient";
import bigInt from "big-integer";

const apiId = process.env.TELEGRAM_API_ID;
const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession(process.env.TELEGRAM_SESSION);

if (!apiId || !apiHash) {
    throw new Error("Telegram API credentials are not properly configured.");
}

const client = new TelegramClient(stringSession, parseInt(apiId), apiHash, {
    connectionRetries: 5,
});

export default async function addTelegramContact(patientData: Partial<IPatient>): Promise<{ userId: string; accessHash: string | undefined }> {
    try {
        console.log("[addTelegramContact] Starting to add Telegram contact...");
        console.log("[addTelegramContact] Patient data:", JSON.stringify(patientData, null, 2));

        if (!client.connected) {
            console.log("[addTelegramContact] Connecting to Telegram...");
            await client.connect();
            console.log("[addTelegramContact] Connected to Telegram successfully.");
        }

        const { firstName, lastName, phone } = patientData;

        if (!phone?.countryCode || !phone?.phoneNumber) {
            console.error("[addTelegramContact] Error: Phone number is missing from patient data.");
            throw new Error("Both country code and phone number are required to add a Telegram contact.");
        }

        const fullPhoneNumber = `${phone.countryCode}${phone.phoneNumber}`.replace(/[^0-9+]/g, '');
        console.log(`[addTelegramContact] Full phone number: ${fullPhoneNumber}`);

        const result = await client.invoke(
            new Api.contacts.ImportContacts({
                contacts: [
                    new Api.InputPhoneContact({
                        clientId: bigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
                        phone: fullPhoneNumber,
                        firstName: firstName || "",
                        lastName: lastName || "",
                    }),
                ],
            })
        );

        console.log("[addTelegramContact] Import contacts result:", JSON.stringify(result, null, 2));
        if (result.users.length === 0) {
            console.error("[addTelegramContact] No user found on Telegram with the provided phone number.");

            if (result.popularInvites.length > 0) {
                console.log("[addTelegramContact] Popular invites found:", JSON.stringify(result.popularInvites, null, 2));

                // Extract details of popular invites
                const popularContacts = result.popularInvites.map(invite => ({
                    clientId: invite.clientId,
                    importers: invite.importers,
                }));

                console.log("[addTelegramContact] Popular contacts processed:", popularContacts);

                // Optionally return or log these for further action
                throw new Error("User found in popular contacts, but privacy settings may prevent addition.");
            }

            if (result.retryContacts.length > 0) {
                console.log("[addTelegramContact] Retry contacts available:", result.retryContacts);
            }

            throw new Error("No Telegram user found with the provided phone number.");
        }
        const user = result.users[0];
        console.log("[addTelegramContact] User found:", JSON.stringify(user, null, 2));

        return {
            userId: user.id.toString(),
            accessHash: 'accessHash' in user ? user.accessHash?.toString() : undefined,
        };
    } catch (error) {
        console.error("[addTelegramContact] Error adding Telegram contact:", error);
        throw new Error(`Failed to add contact or retrieve valid contact information: ${(error as Error).message}`);
    }
}


