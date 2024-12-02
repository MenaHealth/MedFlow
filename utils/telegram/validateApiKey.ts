// utils/telegram/validateApiKey.ts
export function validateApiKey(authHeader: string | null): boolean {
    if (!authHeader) {
        console.error('Authorization header is missing');
        return false;
    }

    // Dynamically select the expected key based on the environment
    const envKey =
        process.env.NODE_ENV === 'development'
            ? process.env.DEV_TELEGRAM_BOT_KEY
            : process.env.PROD_TELEGRAM_BOT_KEY;

    if (!envKey) {
        console.error('Expected key is missing in environment variables');
        return false;
    }

    let providedKey = '';
    try {
        // Extract and decode the provided key
        providedKey = decodeURIComponent(authHeader.split(' ')[1] || '');
    } catch (error) {
        console.error('Error decoding provided key:', error);
        return false;
    }

    // console.log('Decoded Provided Key:', providedKey);
    // console.log('Expected Key:', envKey);

    // Compare provided key with the expected key
    return providedKey === envKey;
}