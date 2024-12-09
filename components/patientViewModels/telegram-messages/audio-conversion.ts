// components/patientViewModels/telegram-messages/audio-conversion.ts

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

/**
 * Converts the recorded audio (which may be in MP4 or WebM format)
 * into OGG (Opus) format.
 * @param inputBlob - The raw audio Blob from the browser MediaRecorder.
 * @returns A Promise resolving to a converted Blob in OGG/Opus format.
 */
export async function convertToOpus(inputBlob: Blob): Promise<Blob> {
    console.log("[DEBUG] Converting audio file:", {
        type: inputBlob.type,
        size: inputBlob.size,
    });

    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    // Determine input file extension based on MIME type
    let inputFileName = 'input.webm';
    if (inputBlob.type.includes('mp4')) {
        inputFileName = 'input.mp4';
    } else if (inputBlob.type.includes('ogg')) {
        inputFileName = 'input.ogg';
    }

    const outputFileName = 'output.ogg';

    await ffmpeg.writeFile(inputFileName, await fetchFile(inputBlob));

    // Convert to OGG (Opus)
    await ffmpeg.exec([
        '-i', inputFileName,
        '-c:a', 'libopus',
        '-b:a', '160k',    // or another desired bitrate
        '-ar', '48000',
        outputFileName,
    ]);

    const data = (await ffmpeg.readFile(outputFileName)) as Uint8Array;

    console.log("[DEBUG] Conversion successful. Output file size:", data.byteLength);

    return new Blob([data], { type: 'audio/ogg' });
}