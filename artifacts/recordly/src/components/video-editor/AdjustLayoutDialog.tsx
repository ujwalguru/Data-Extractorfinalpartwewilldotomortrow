import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WebcamOverlaySettings, WebcamPositionPreset } from "./types";
import { DEFAULT_WEBCAM_POSITION_X, DEFAULT_WEBCAM_POSITION_Y } from "./types";

interface AdjustLayoutDialogProps {
        webcam: WebcamOverlaySettings;
        onApply: (positionX: number, positionY: number) => void;
        onCancel: () => void;
}

export function AdjustLayoutDialog({ webcam, onApply, onCancel }: AdjustLayoutDialogProps) {
        const [posX, setPosX] = useState(
                webcam.positionPreset === "custom" ? webcam.positionX : getDefaultX(webcam.positionPreset),
        );
        const [posY, setPosY] = useState(
                webcam.positionPreset === "custom" ? webcam.positionY : getDefaultY(webcam.positionPreset),
        );

        const previewRef = useRef<HTMLDivElement>(null);
        const dragging = useRef(false);

        function getDefaultX(preset: WebcamPositionPreset): number {
                switch (preset) {
                        case "top-left":
                        case "center-left":
                        case "bottom-left":
                                return 0;
                        case "top-center":
                        case "center":
                        case "bottom-center":
                                return 0.5;
                        default:
                                return 1;
                }
        }

        function getDefaultY(preset: WebcamPositionPreset): number {
                switch (preset) {
                        case "top-left":
                        case "top-center":
                        case "top-right":
                                return 0;
                        case "center-left":
                        case "center":
                        case "center-right":
                                return 0.5;
                        default:
                                return 1;
                }
        }

        const camSize = Math.min(webcam.size, 35);
        const camW = camSize;
        const camH = camSize / (webcam.webcamAspectRatio ?? 1);

        function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
                dragging.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                updatePos(e);
        }

        function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
                if (!dragging.current) return;
                updatePos(e);
        }

        function handlePointerUp() {
                dragging.current = false;
        }

        function updatePos(e: React.PointerEvent<HTMLDivElement>) {
                const el = previewRef.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                setPosX(x);
                setPosY(y);
        }

        const camLeft = posX * (100 - camW);
        const camTop = posY * (100 - camH);

        return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="flex w-[520px] max-w-[95vw] flex-col gap-5 rounded-2xl border border-foreground/10 bg-[#0f1117] p-6 shadow-2xl">
                                <h2 className="text-base font-semibold text-foreground">Custom Layout</h2>

                                {/* Preview canvas */}
                                <div
                                        ref={previewRef}
                                        className="relative aspect-video w-full cursor-crosshair select-none overflow-hidden rounded-xl border border-foreground/10 bg-[#0d0f1a]"
                                        onPointerDown={handlePointerDown}
                                        onPointerMove={handlePointerMove}
                                        onPointerUp={handlePointerUp}
                                >
                                        {/* Screen content placeholder */}
                                        <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-[18%]">
                                                <div className="h-1.5 rounded-full bg-foreground/[0.08] w-[55%]" />
                                                <div className="h-1.5 rounded-full bg-foreground/[0.05] w-[40%]" />
                                                <div className="h-1.5 rounded-full bg-foreground/[0.06] w-[50%]" />
                                        </div>

                                        {/* Drag instruction */}
                                        <div className="absolute inset-x-0 top-2 flex justify-center">
                                                <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] text-foreground/50">
                                                        Drag to position camera
                                                </span>
                                        </div>

                                        {/* Camera overlay */}
                                        <div
                                                className={cn(
                                                        "absolute flex items-center justify-center",
                                                        "pointer-events-none",
                                                )}
                                                style={{
                                                        left: `${camLeft}%`,
                                                        top: `${camTop}%`,
                                                        width: `${camW}%`,
                                                        height: `${camH}%`,
                                                        borderRadius: webcam.cornerRadius >= 100 ? "50%" : `${Math.min(webcam.cornerRadius * 0.04, 1.2)}rem`,
                                                        background: "linear-gradient(135deg, #6d28d9, #4c1d95)",
                                                        border: "2px solid rgba(139,92,246,0.7)",
                                                        boxShadow: "0 4px 20px rgba(109,40,217,0.5)",
                                                }}
                                        >
                                                <svg viewBox="0 0 24 24" fill="none" className="w-1/3 opacity-70">
                                                        <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.8)" />
                                                        <path
                                                                d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"
                                                                stroke="rgba(255,255,255,0.6)"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                        />
                                                </svg>
                                        </div>

                                        {/* Grid guides */}
                                        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
                                                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
                                                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
                                                <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
                                                <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
                                        </div>
                                </div>

                                {/* Position sliders */}
                                <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] text-muted-foreground">Horizontal</label>
                                                <input
                                                        type="range"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        value={Math.round(posX * 100)}
                                                        onChange={(e) => setPosX(Number(e.target.value) / 100)}
                                                        className="accent-violet-500"
                                                />
                                                <span className="text-[10px] text-muted-foreground/60">{Math.round(posX * 100)}%</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] text-muted-foreground">Vertical</label>
                                                <input
                                                        type="range"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        value={Math.round(posY * 100)}
                                                        onChange={(e) => setPosY(Number(e.target.value) / 100)}
                                                        className="accent-violet-500"
                                                />
                                                <span className="text-[10px] text-muted-foreground/60">{Math.round(posY * 100)}%</span>
                                        </div>
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                        <Button
                                                type="button"
                                                variant="outline"
                                                onClick={onCancel}
                                                className="h-8 border-foreground/10 bg-foreground/5 px-4 text-[12px] text-foreground hover:bg-foreground/10"
                                        >
                                                Cancel
                                        </Button>
                                        <Button
                                                type="button"
                                                onClick={() => onApply(posX, posY)}
                                                className="h-8 bg-violet-600 px-4 text-[12px] text-white hover:bg-violet-700"
                                        >
                                                Apply
                                        </Button>
                                </div>
                        </div>
                </div>
        );
}

