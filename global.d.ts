// global.d.ts

declare module 'opus-stream-decoder' {
    export function createWebAssemblyDecoder(options: {
        wasmBinary: ArrayBuffer;
    }): Promise<{
        decode: (arrayBuffer: ArrayBuffer) => Promise<{
            channelData: Float32Array[]; // PCM data for each channel
            sampleRate: number; // Sampling rate of the audio
            channelCount: number; // Number of audio channels
        }>;
    }>;
}