// components/addTelegramContact.tsx


import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { Api } from "telegram";
import { IPatient } from "@/models/patient";
import BigInt from "big-integer";

const apiId = process.env.TELEGRAM_API_ID || "";
const apiHash = process.env.TELEGRAM_API_HASH || "";
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");

if (!apiId || !apiHash) {
    throw new Error("TELEGRAM_API_ID or TELEGRAM_API_HASH is not defined in the environment variables.");
}

const client = new TelegramClient(stringSession, parseInt(apiId), apiHash, {
    connectionRetries: 5,
});

async function addTelegramContact(patient: IPatient) {
    try {
        const phoneNumber = patient.phone?.phoneNumber || "";
        const firstName = patient.firstName || "";
        const lastName = patient.lastName || "";

        if (!phoneNumber || !firstName) {
            throw new Error("Phone number or first name is missing.");
        }

        // Ensure the Telegram client is connected
        if (!client.connected) {
            await client.connect();
        }

        // Generate a random long number for clientId
        const clientId = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));

        // Add contact using MTProto InputPhoneContact class
        const contact = new Api.InputPhoneContact({
            clientId: clientId,
            phone: phoneNumber,
            firstName: firstName,
            lastName: lastName,
        });

        const response = await client.invoke(
            new Api.contacts.ImportContacts({
                contacts: [contact],
            })
        );

        // Filter valid users with accessHash
        const validUsers = response.users.filter(
            (user): user is Api.User => "accessHash" in user
        );

        if (!validUsers || validUsers.length === 0) {
            throw new Error("Failed to add contact or retrieve valid contact information.");
        }

        const user = validUsers[0]; // Retrieve the first valid user

        return {
            userId: user.id,
            accessHash: user.accessHash,
        };
    } catch (error) {
        console.error("Error adding Telegram contact:", error);
        throw error;
    }
}

export default addTelegramContact;





