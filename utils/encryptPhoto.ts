import CryptoJS from 'crypto-js';

export const encryptPhoto = (file: File, encryptionKey: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = CryptoJS.lib.WordArray.create(reader.result as ArrayBuffer);
            const encrypted = CryptoJS.AES.encrypt(fileContent, encryptionKey).toString();
            resolve(encrypted);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

export const decryptPhoto = async (encryptedBase64: string, encryptionKey: string): Promise<Blob> => {
    try {
        // Convert encryptionKey to WordArray
        // const key = CryptoJS.enc.Base64.parse(encryptionKey);

        // Decrypt using CryptoJS
        const decryptedData = CryptoJS.AES.decrypt(encryptedBase64, encryptionKey);

        // Convert decrypted WordArray to ArrayBuffer
        const decryptedArrayBuffer = decryptedData.toString(CryptoJS.enc.Base64url);
        console.log("Decrypted Array Buffer (Latin1):", decryptedArrayBuffer);

        const decryptedUint8Array = new Uint8Array(decryptedArrayBuffer.length);
        for (let i = 0; i < decryptedArrayBuffer.length; i++) {
            decryptedUint8Array[i] = decryptedArrayBuffer.charCodeAt(i);
        }

        console.log("Decrypted Uint8Array:", decryptedUint8Array);

        // Create Blob from Uint8Array
        const decryptedBlob = new Blob([decryptedUint8Array], { type: 'image/webp' });
        console.log("Decrypted Blob:", decryptedBlob);

        return decryptedBlob;
    } catch (error) {
        console.error('Error decrypting photo:', error);
        throw error;
    }
};



export const generateEncryptionKey = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);

    const numArray = Array.from(array);

    return btoa(String.fromCharCode.apply(null, numArray));
};

export const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.src = reader.result as string;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to create canvas context'));
                    return;
                }
                ctx.drawImage(image, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert image to WebP'));
                    }
                }, 'image/webp', 0.9);
            };
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

// Function to calculate SHA-256 hash of a File object
export const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};
