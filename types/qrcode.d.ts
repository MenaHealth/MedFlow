// types/qrcode.d.ts
declare module 'qrcode' {
    export function toDataURL(
        text: string,
        options?: {
            errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
            type?: 'image/png' | 'image/jpeg' | 'image/webp';
            quality?: number;
            margin?: number;
            scale?: number;
            width?: number;
            color?: {
                dark?: string; // Color of dark modules
                light?: string; // Color of light modules
            };
        }
    ): Promise<string>;
}