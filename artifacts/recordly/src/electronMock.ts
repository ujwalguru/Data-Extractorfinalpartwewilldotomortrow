import { getBrowserVideoUrl, setBrowserWebcamVideo, getBrowserWebcamVideoUrl } from "./browserVideoStore";

const noop = () => {};
const asyncNoop = async () => {};
const asyncNull = async () => null;
const asyncFalse = async () => ({ success: false, error: "Not available in browser" });
const asyncEmpty = async () => [];
const noopCleanup = () => noop;

if (typeof window !== "undefined" && !("__ELECTRON__" in window)) {
        (window as unknown as Record<string, unknown>).electronAPI = {
                hudOverlaySetIgnoreMouse: noop,
                hudOverlayDrag: noop,
                hudOverlayHide: noop,
                hudOverlayClose: noop,
                hudOverlayRendererReady: noop,
                getHudOverlayCaptureProtection: async () => false,
                getHudOverlayMousePassthroughSupported: async () => false,
                setHudOverlayCaptureProtection: asyncNoop,

                getAssetBasePath: async () => "/",
                listAssetDirectory: asyncEmpty,
                readLocalFile: asyncNull,
                generateWallpaperThumbnail: asyncNull,

                probeNativeVideoMetadata: asyncFalse,
                nativeStaticLayoutExport: asyncFalse,
                nativeStaticLayoutExportCancel: asyncNoop,
                onNativeStaticLayoutExportProgress: noopCleanup,
                nativeVideoExportStart: asyncFalse,
                nativeVideoExportWriteFrame: asyncFalse,
                nativeVideoExportWriteFrames: asyncFalse,
                nativeVideoExportFinish: asyncFalse,
                nativeVideoExportCancel: asyncNoop,
                muxExportedVideoAudio: asyncFalse,
                muxExportedVideoAudioFromPath: asyncFalse,
                muxNativeWindowsRecording: asyncFalse,
                openExportStream: asyncFalse,
                writeExportStreamChunk: asyncFalse,
                closeExportStream: asyncFalse,
                finalizeExportedVideo: asyncFalse,
                discardExportedTemp: asyncNoop,
                saveExportedVideo: asyncFalse,
                writeExportedVideoToPath: asyncFalse,
                getVideoAudioFallbackPaths: async () => ({ success: true, paths: [], startDelayMsByPath: {} }),

                getSources: asyncEmpty,
                switchToEditor: asyncNoop,
                openSourceSelector: asyncNoop,
                selectSource: asyncNoop,
                showSourceHighlight: asyncNoop,
                getSelectedSource: asyncNull,
                onSelectedSourceChanged: noopCleanup,

                startNativeScreenRecording: asyncFalse,
                stopNativeScreenRecording: asyncFalse,
                recoverNativeScreenRecording: asyncFalse,
                getLastNativeCaptureDiagnostics: asyncNull,
                pauseNativeScreenRecording: asyncNoop,
                resumeNativeScreenRecording: asyncNoop,
                pauseCursorCapture: asyncNoop,
                resumeCursorCapture: asyncNoop,
                storeRecordedVideo: asyncFalse,
                storeMicrophoneSidecar: asyncFalse,
                isNativeWindowsCaptureAvailable: async () => false,

                setCurrentRecordingSession: asyncNoop,
                getCurrentRecordingSession: asyncNull,
                onRecordingSessionChanged: noopCleanup,
                setRecordingState: asyncNoop,
                setCurrentVideoPath: asyncNoop,
                getCurrentVideoPath: async () => {
                        const blobUrl = getBrowserVideoUrl();
                        if (blobUrl) {
                                return { success: true, path: `browser-blob:${blobUrl}` };
                        }
                        return { success: true, path: "file:///demo.webm" };
                },
                setHasUnsavedChanges: asyncNoop,

                getCursorTelemetry: asyncFalse,
                hideOsCursor: asyncNoop,

                listProjectFiles: async () => ({ success: false, entries: [], error: "Not available in browser" }),
                loadCurrentProjectFile: asyncFalse,
                saveProjectFile: asyncFalse,
                saveProjectFileNamed: asyncFalse,
                openProjectFileAtPath: asyncFalse,
                onMenuLoadProject: noopCleanup,
                onMenuSaveProject: noopCleanup,
                onMenuSaveProjectAs: noopCleanup,
                onRequestSaveBeforeClose: noopCleanup,

                getRecordingPreferences: async () => ({}),
                setRecordingPreferences: asyncNoop,
                getRecordingAudioLabConfig: async () => ({}),
                getRecordingsDirectory: asyncNull,
                chooseRecordingsDirectory: asyncNull,
                deleteRecordingFile: asyncFalse,

                getLocalMediaUrl: async (path: string) => {
                        if (typeof path === "string" && path.startsWith("browser-blob:")) {
                                return { success: true, url: path.slice("browser-blob:".length) };
                        }
                        if (typeof path === "string" && path.startsWith("/browser-webcam/")) {
                                const url = getBrowserWebcamVideoUrl();
                                return { success: true, url: url ?? "" };
                        }
                        return { success: true, url: typeof path === "string" && path.startsWith("/") ? path : `/${path}` };
                },
                openAudioFilePicker: asyncNull,
                openVideoFilePicker: async () => {
                        return new Promise<{ success: boolean; path?: string | null } | null>((resolve) => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "video/mp4,video/webm,video/quicktime,video/x-matroska,video/avi,.mp4,.webm,.mov,.mkv,.avi";
                                let resolved = false;
                                const finish = (file: File | null) => {
                                        if (resolved) return;
                                        resolved = true;
                                        input.remove();
                                        if (!file) {
                                                resolve({ success: false });
                                                return;
                                        }
                                        setBrowserWebcamVideo(file);
                                        resolve({ success: true, path: `/browser-webcam/${file.name}` });
                                };
                                input.onchange = () => finish(input.files?.[0] ?? null);
                                input.oncancel = () => finish(null);
                                document.body.appendChild(input);
                                input.click();
                        });
                },

                revealInFolder: asyncNoop,
                openExternalUrl: asyncNoop,

                getAppVersion: async () => "1.0.0-web",
                getPlatform: async () => "web",

                getScreenRecordingPermissionStatus: async () => "not-determined",
                openScreenRecordingPreferences: asyncNoop,
                getAccessibilityPermissionStatus: async () => "not-determined",
                openAccessibilityPreferences: asyncNoop,
                requestAccessibilityPermission: asyncNoop,

                checkForAppUpdates: asyncNoop,
                downloadAvailableUpdate: asyncNoop,
                deferDownloadedUpdate: asyncNoop,
                installDownloadedUpdate: asyncNoop,
                onUpdateToastStateChanged: noopCleanup,
                previewUpdateToast: asyncNoop,
                getCurrentUpdateToastPayload: asyncNull,
                dismissUpdateToast: asyncNoop,

                startCountdown: asyncNoop,
                cancelCountdown: asyncNoop,
                getCountdownDelay: async () => 3,
                setCountdownDelay: asyncNoop,
                getActiveCountdown: asyncNull,
                onCountdownTick: noopCleanup,

                onStopRecordingFromTray: noopCleanup,

                getWhisperSmallModelStatus: async () => ({ installed: false }),
                downloadWhisperSmallModel: asyncNoop,
                deleteWhisperSmallModel: asyncNoop,
                onWhisperSmallModelDownloadProgress: noopCleanup,
                generateAutoCaptions: asyncFalse,
                openWhisperExecutablePicker: asyncNull,
                openWhisperModelPicker: asyncNull,
        };
}

export {};
