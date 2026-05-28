import { cn } from "@/lib/utils";
import type { WebcamOverlaySettings, WebcamPositionPreset } from "./types";

export type LayoutPreset = Exclude<WebcamPositionPreset, "custom">;

export interface CameraLayoutPanelProps {
        webcam: WebcamOverlaySettings | undefined;
        webcamPositionPreset: WebcamPositionPreset;
        onApplyLayout: (preset: LayoutPreset, size: number, cornerRadius: number, aspectRatio: number, margin: number) => void;
}

function PersonSilhouette({ cx, cy, r }: { cx: number; cy: number; r: number }) {
        return (
                <>
                        <circle cx={cx} cy={cy} r={r} fill="rgba(200,220,255,0.75)" />
                        <path
                                d={`M ${cx - r * 2} ${cy + r * 4.5} C ${cx - r * 1.1} ${cy + r * 1.6} ${cx - r * 0.35} ${cy + r * 1.1} ${cx} ${cy + r} C ${cx + r * 0.35} ${cy + r * 1.1} ${cx + r * 1.1} ${cy + r * 1.6} ${cx + r * 2} ${cy + r * 4.5} Z`}
                                fill="rgba(160,195,255,0.48)"
                        />
                </>
        );
}

function VideoLines({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
        const lw1 = w * 0.58;
        const lw2 = w * 0.38;
        const ly = y + h * 0.52;
        const lx1 = x + (w - lw1) / 2;
        const lx2 = x + (w - lw2) / 2;
        return (
                <>
                        <rect x={lx1} y={ly} width={lw1} height={1.3} rx={0.65} fill="rgba(255,255,255,0.09)" />
                        <rect x={lx2} y={ly + 3.5} width={lw2} height={1.0} rx={0.5} fill="rgba(255,255,255,0.06)" />
                </>
        );
}

const W = 60;
const H = 34;
const CAM_BG = "#1a3566";
const CAM_BG_DARK = "#0d1e3e";
const CAM_STROKE = "rgba(100,155,255,0.45)";
const CANVAS_BG = "#0b0d17";

export function CameraLayoutPanel({ webcam, webcamPositionPreset, onApplyLayout }: CameraLayoutPanelProps) {
        const currentSize = webcam?.size ?? 25;
        const currentAspectRatio = webcam?.webcamAspectRatio ?? 1;
        const currentCornerRadius = webcam?.cornerRadius ?? 18;

        const layouts = [
                {
                        id: "top-left-overlay",
                        label: "Top Left Overlay",
                        preset: "top-left" as LayoutPreset,
                        size: 24,
                        cornerRadius: 12,
                        aspectRatio: 16 / 9,
                        margin: 16,
                        active:
                                webcamPositionPreset === "top-left" &&
                                currentSize < 50 &&
                                currentAspectRatio >= 1.5,
                        svg: (
                                <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                        <defs>
                                                <clipPath id="l1c"><rect x={2} y={2} width={18} height={10} rx={1.5} /></clipPath>
                                        </defs>
                                        <rect width={W} height={H} fill={CANVAS_BG} />
                                        <VideoLines x={16} y={0} w={44} h={H} />
                                        <rect x={2} y={2} width={18} height={10} rx={1.5} fill={CAM_BG} />
                                        <rect x={2} y={8.5} width={18} height={3.5} fill={CAM_BG_DARK} />
                                        <g clipPath="url(#l1c)"><PersonSilhouette cx={11} cy={7} r={2} /></g>
                                        <rect x={2} y={2} width={18} height={10} rx={1.5} fill="none" stroke={CAM_STROKE} strokeWidth={0.7} />
                                </svg>
                        ),
                },
                {
                        id: "left-split",
                        label: "Left Split",
                        preset: "top-left" as LayoutPreset,
                        size: 100,
                        cornerRadius: 0,
                        aspectRatio: 8 / 9,
                        margin: 0,
                        active:
                                (webcamPositionPreset === "top-left" || webcamPositionPreset === "center-left") &&
                                currentSize >= 70 &&
                                currentAspectRatio >= 0.75 &&
                                currentAspectRatio < 1.1 &&
                                currentCornerRadius < 20,
                        svg: (
                                <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                        <defs>
                                                <clipPath id="l2c"><rect x={0} y={0} width={21} height={H} /></clipPath>
                                        </defs>
                                        <rect width={W} height={H} fill={CANVAS_BG} />
                                        <VideoLines x={22} y={0} w={38} h={H} />
                                        <rect x={0} y={0} width={21} height={H} fill={CAM_BG} />
                                        <rect x={0} y={H * 0.7} width={21} height={H * 0.3} fill={CAM_BG_DARK} />
                                        <g clipPath="url(#l2c)"><PersonSilhouette cx={10.5} cy={13} r={3.5} /></g>
                                        <rect x={0} y={0} width={21} height={H} fill="none" stroke={CAM_STROKE} strokeWidth={0.7} />
                                        <rect x={21} y={0} width={0.8} height={H} fill="rgba(255,255,255,0.05)" />
                                </svg>
                        ),
                },
                {
                        id: "right-split",
                        label: "Right Split",
                        preset: "top-right" as LayoutPreset,
                        size: 100,
                        cornerRadius: 0,
                        aspectRatio: 8 / 9,
                        margin: 0,
                        active:
                                (webcamPositionPreset === "top-right" || webcamPositionPreset === "center-right") &&
                                currentSize >= 70 &&
                                currentAspectRatio >= 0.75 &&
                                currentAspectRatio < 1.1 &&
                                currentCornerRadius < 20,
                        svg: (
                                <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                        <defs>
                                                <clipPath id="l3c"><rect x={39} y={0} width={21} height={H} /></clipPath>
                                        </defs>
                                        <rect width={W} height={H} fill={CANVAS_BG} />
                                        <VideoLines x={0} y={0} w={38} h={H} />
                                        <rect x={38.2} y={0} width={0.8} height={H} fill="rgba(255,255,255,0.05)" />
                                        <rect x={39} y={0} width={21} height={H} fill={CAM_BG} />
                                        <rect x={39} y={H * 0.7} width={21} height={H * 0.3} fill={CAM_BG_DARK} />
                                        <g clipPath="url(#l3c)"><PersonSilhouette cx={49.5} cy={13} r={3.5} /></g>
                                        <rect x={39} y={0} width={21} height={H} fill="none" stroke={CAM_STROKE} strokeWidth={0.7} />
                                </svg>
                        ),
                },
                {
                        id: "bottom-left-circle",
                        label: "Bottom Left Circle",
                        preset: "bottom-left" as LayoutPreset,
                        size: 22,
                        cornerRadius: 160,
                        aspectRatio: 1,
                        margin: 16,
                        active:
                                webcamPositionPreset === "bottom-left" &&
                                currentCornerRadius >= 100,
                        svg: (
                                <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                        <defs>
                                                <clipPath id="l4c"><circle cx={9} cy={26.5} r={6.5} /></clipPath>
                                        </defs>
                                        <rect width={W} height={H} fill={CANVAS_BG} />
                                        <VideoLines x={12} y={0} w={44} h={H} />
                                        <circle cx={9} cy={26.5} r={6.5} fill={CAM_BG} />
                                        <ellipse cx={9} cy={31} rx={6.5} ry={3} fill={CAM_BG_DARK} />
                                        <g clipPath="url(#l4c)"><PersonSilhouette cx={9} cy={24} r={1.9} /></g>
                                        <circle cx={9} cy={26.5} r={6.5} fill="none" stroke={CAM_STROKE} strokeWidth={0.7} />
                                </svg>
                        ),
                },
                {
                        id: "bottom-center-bar",
                        label: "Bottom Camera Bar",
                        preset: "bottom-center" as LayoutPreset,
                        size: 20,
                        cornerRadius: 24,
                        aspectRatio: 4.5,
                        margin: 16,
                        active:
                                webcamPositionPreset === "bottom-center" &&
                                currentAspectRatio >= 2,
                        svg: (
                                <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                        <defs>
                                                <clipPath id="l5c"><rect x={3} y={23.5} width={54} height={9.5} rx={3.5} /></clipPath>
                                        </defs>
                                        <rect width={W} height={H} fill={CANVAS_BG} />
                                        <VideoLines x={0} y={0} w={W} h={22} />
                                        <rect x={3} y={23.5} width={54} height={9.5} rx={3.5} fill={CAM_BG} />
                                        <rect x={3} y={29} width={54} height={4} rx={2} fill={CAM_BG_DARK} />
                                        <g clipPath="url(#l5c)"><PersonSilhouette cx={30} cy={27.5} r={1.9} /></g>
                                        <rect x={3} y={23.5} width={54} height={9.5} rx={3.5} fill="none" stroke={CAM_STROKE} strokeWidth={0.7} />
                                </svg>
                        ),
                },
                {
                        id: "full-height-side",
                        label: "Full Height Side Cam",
                        preset: "top-left" as LayoutPreset,
                        size: 88,
                        cornerRadius: 24,
                        aspectRatio: 9 / 16,
                        margin: 8,
                        active:
                                (webcamPositionPreset === "top-left" || webcamPositionPreset === "center-left") &&
                                currentAspectRatio < 0.7,
                        svg: (
                                <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                        <defs>
                                                <clipPath id="l6c"><rect x={1} y={1} width={16} height={H - 2} rx={2.5} /></clipPath>
                                        </defs>
                                        <rect width={W} height={H} fill={CANVAS_BG} />
                                        <VideoLines x={20} y={0} w={38} h={H} />
                                        <rect x={1} y={1} width={16} height={H - 2} rx={2.5} fill={CAM_BG} />
                                        <rect x={1} y={H * 0.72} width={16} height={H * 0.28 - 1} rx={1} fill={CAM_BG_DARK} />
                                        <g clipPath="url(#l6c)"><PersonSilhouette cx={9} cy={12} r={3.5} /></g>
                                        <rect x={1} y={1} width={16} height={H - 2} rx={2.5} fill="none" stroke={CAM_STROKE} strokeWidth={0.7} />
                                        <rect x={17.6} y={0} width={0.8} height={H} fill="rgba(255,255,255,0.05)" />
                                </svg>
                        ),
                },
        ];

        return (
                <div className="flex flex-col gap-2">
                        <div className="text-[9px] font-semibold text-muted-foreground/55 uppercase tracking-widest">
                                Camera Layout
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                                {layouts.map((layout) => (
                                        <button
                                                key={layout.id}
                                                type="button"
                                                onClick={() => onApplyLayout(layout.preset, layout.size, layout.cornerRadius, layout.aspectRatio, layout.margin)}
                                                title={layout.label}
                                                className={cn(
                                                        "group relative flex flex-col items-center gap-1.5 rounded-xl border p-1 pb-1.5 transition-all duration-150 cursor-pointer",
                                                        "hover:scale-[1.05] active:scale-[0.97]",
                                                        layout.active
                                                                ? "border-blue-500/60 bg-blue-500/[0.08] shadow-[0_0_14px_rgba(59,130,246,0.22)]"
                                                                : "border-foreground/[0.08] bg-foreground/[0.03] hover:border-foreground/[0.18] hover:bg-foreground/[0.06]",
                                                )}
                                        >
                                                <div
                                                        className={cn(
                                                                "w-full overflow-hidden rounded-lg transition-all duration-150",
                                                                layout.active
                                                                        ? "ring-1 ring-blue-500/40"
                                                                        : "ring-1 ring-foreground/[0.05] group-hover:ring-foreground/[0.10]",
                                                        )}
                                                >
                                                        {layout.svg}
                                                </div>
                                                <span
                                                        className={cn(
                                                                "text-[7px] font-medium leading-tight text-center transition-colors",
                                                                layout.active
                                                                        ? "text-blue-400"
                                                                        : "text-muted-foreground/50 group-hover:text-muted-foreground/75",
                                                        )}
                                                >
                                                        {layout.label}
                                                </span>
                                                {layout.active && (
                                                        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.85)]" />
                                                )}
                                        </button>
                                ))}
                        </div>
                </div>
        );
}
