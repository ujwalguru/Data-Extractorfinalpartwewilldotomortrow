let _videoBlobUrl: string | null = null;
let _videoName: string = "demo";

export function setBrowserVideo(file: File): string {
        if (_videoBlobUrl) URL.revokeObjectURL(_videoBlobUrl);
        _videoBlobUrl = URL.createObjectURL(file);
        _videoName = file.name.replace(/\.[^.]+$/, "");
        return _videoBlobUrl;
}

export function getBrowserVideoUrl(): string | null {
        return _videoBlobUrl;
}

export function getBrowserVideoName(): string {
        return _videoName;
}

export function clearBrowserVideo(): void {
        if (_videoBlobUrl) {
                URL.revokeObjectURL(_videoBlobUrl);
                _videoBlobUrl = null;
        }
        _videoName = "demo";
}

// Webcam video storage (for browser file picker uploads)
let _webcamBlobUrl: string | null = null;
let _webcamFileName: string = "webcam";

export function setBrowserWebcamVideo(file: File): string {
        if (_webcamBlobUrl) URL.revokeObjectURL(_webcamBlobUrl);
        _webcamBlobUrl = URL.createObjectURL(file);
        _webcamFileName = file.name;
        return _webcamBlobUrl;
}

export function getBrowserWebcamVideoUrl(): string | null {
        return _webcamBlobUrl;
}

export function getBrowserWebcamFileName(): string {
        return _webcamFileName;
}

export function clearBrowserWebcamVideo(): void {
        if (_webcamBlobUrl) {
                URL.revokeObjectURL(_webcamBlobUrl);
                _webcamBlobUrl = null;
        }
        _webcamFileName = "webcam";
}

export {};
