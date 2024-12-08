// components/patientViewModels/telegram-messages/audio-conversion.ts

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

/**
 * Converts an OGG file to a Telegram-compatible OGG (Opus codec).
 * @param inputBlob - The raw audio Blob from the browser MediaRecorder.
 * @returns A Promise resolving to a converted Blob in the correct format.
 */
export async function convertToOpus(inputBlob: Blob): Promise<Blob> {
    console.log("[DEBUG] Converting audio file:", {
        type: inputBlob.type,
        size: inputBlob.size,
    });

    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    const inputFileName = 'input.ogg';
    const outputFileName = 'output.ogg';

    await ffmpeg.writeFile(inputFileName, await fetchFile(inputBlob));

    await ffmpeg.exec([
        '-i', inputFileName,
        '-c:a', 'libopus',
        '-b:a', '16000',
        '-ar', '48000',
        outputFileName,
    ]);

    const data = await ffmpeg.readFile(outputFileName);

    console.log("[DEBUG] Conversion successful. Output file size:", data);

    return new Blob([data], { type: 'audio/ogg' });
}