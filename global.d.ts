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

declare module 'ogg-parser' {
    import { Readable } from 'stream';

    // OggParser extends Readable to process streams of Ogg data
    export default class OggParser extends Readable {
        constructor();
        write(chunk: Buffer): void; // Writes data to the parser
        end(): void; // Signals the end of the stream
        on(event: 'data', listener: (page: { segment: Uint8Array }) => void): this;
        on(event: 'end', listener: () => void): this;
        on(event: 'error', listener: (error: Error) => void): this;
    }
}