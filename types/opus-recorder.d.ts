declare module 'opus-recorder' {
    interface RecorderOptions {
        encoderPath: string;
        encoderSampleRate?: number;
        numberOfChannels?: number;
        streamPages?: boolean;
        maxFramesPerPage?: number;
        wavBitDepth?: number;
        leaveStreamOpen?: boolean;
        originalSampleRateOverride?: number;
        resampleQuality?: number;
        ondataavailable?: (blob: Blob) => void;
        onstop?: () => void;
        onstart?: () => void;
    }

    export default class Recorder {
        constructor(options: RecorderOptions);
        start(): void;
        stop(): void;
    }
}