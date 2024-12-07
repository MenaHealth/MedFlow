    // components/patientViewModels/telegram-messages/audio-conversion.ts

    import { FFmpeg } from '@ffmpeg/ffmpeg';
    import { fetchFile } from '@ffmpeg/util';

    /**
     * Converts an OGG file to a Telegram-compatible OGG (Opus codec).
     * @param inputBlob - The raw audio Blob from the browser MediaRecorder.
     * @returns A Promise resolving to a converted Blob in the correct format.
     */
    export async function convertToOpus(inputBlob: Blob): Promise<Blob> {
        // Create an instance of FFmpeg
        const ffmpeg = new FFmpeg();

        // Ensure FFmpeg is loaded
        await ffmpeg.load();

        // Write the input audio file to FFmpeg's virtual file system
        const inputFileName = 'input.ogg';
        const outputFileName = 'output.ogg';

        await ffmpeg.writeFile(inputFileName, await fetchFile(inputBlob));

        // Run the FFmpeg command to convert the input audio
        await ffmpeg.exec([
            '-i', inputFileName,    // Input file
            '-c:a', 'libopus',      // Use the Opus codec
            '-b:a', '16000',        // Set bitrate to 16kbps
            '-ar', '48000',         // Set sample rate to 48kHz
            outputFileName          // Output file
        ]);

        // Read the converted file from FFmpeg's virtual file system
        const data = await ffmpeg.readFile(outputFileName);

        // Create a Blob from the Uint8Array returned by readFile
        return new Blob([data], { type: 'audio/ogg' });
    }