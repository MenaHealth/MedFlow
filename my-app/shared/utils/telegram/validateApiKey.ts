// utils/telegram/validateApiKey.ts
export function validateApiKey(authHeader: string | null): boolean {
    if (!authHeader) {
        console.error('Authorization header is missing');
        return false;
    }

    const expectedKey = process.env.MEDFLOW_KEY;
    // console.log("expected Key: "+expectedKey)

    if (!expectedKey) {
        // console.error('MEDFLOW_KEY is missing in environment variables');
        return false;
    }

    let providedKey = '';
    try {
        // Extract and decode the provided key
        providedKey = decodeURIComponent(authHeader.split(' ')[1] || '');
        // console.log("provided Key: "+providedKey)
    } catch (error) {
        console.error('Error decoding provided key:', error);
        return false;
    }

    // Compare provided key with the expected key
    return providedKey === expectedKey;
}