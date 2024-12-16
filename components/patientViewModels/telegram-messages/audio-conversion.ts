// components/patientViewModels/telegram-messages/audio-conversion.ts

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface AudioConversionOptions {
    outputFormat: "ogg" | "mp4";
    bitrate?: string; // Default: "192k"
    sampleRate?: string; // Default: "48000"
}

/**
 * Converts an input audio file (e.g., WebM, MP4, OGG) to the desired format.
 * @param inputBlob - The raw audio Blob.
 * @param options - Conversion options (output format, bitrate, sample rate).
 * @returns A Promise resolving to a converted Blob.
 */
export async function convertAudio(
    inputBlob: Blob,
    options: AudioConversionOptions
): Promise<Blob> {
    console.log("[DEBUG] Starting audio conversion with options:", {
        inputType: inputBlob.type,
        size: inputBlob.size,
        ...options,
    });

    const { outputFormat, bitrate = "192k", sampleRate = "48000" } = options;

    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    // Determine input file extension
    let inputFileName = "input.webm";
    if (inputBlob.type.includes("mp4")) {
        inputFileName = "input.mp4";
    } else if (inputBlob.type.includes("ogg")) {
        inputFileName = "input.ogg";
    }

    const outputFileName = `output.${outputFormat}`;

    await ffmpeg.writeFile(inputFileName, await fetchFile(inputBlob));

    // Configure the conversion command
    const command = [
        "-i", inputFileName,
        "-c:a", outputFormat === "ogg" ? "libopus" : "aac",
        "-b:a", bitrate,
        "-ar", sampleRate,
        outputFileName,
    ];

    await ffmpeg.exec(command);

    const data = (await ffmpeg.readFile(outputFileName)) as Uint8Array;

    console.log("[DEBUG] Conversion successful. Output file size:", data.byteLength);

    return new Blob([data], { type: `audio/${outputFormat}` });
}

/**
 * Converts a given audio Blob (e.g., MP4) to OGG/Opus format specifically.
 * This is a convenience wrapper around convertAudio.
 * @param inputBlob - The raw MP4 audio Blob.
 * @returns OGG/Opus audio Blob.
 */
export async function convertToOpus(inputBlob: Blob): Promise<Blob> {
    return await convertAudio(inputBlob, { outputFormat: "ogg" });
}