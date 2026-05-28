import { cn } from "@/lib/utils";
import type { WebcamOverlaySettings, WebcamPositionPreset } from "./types";

export type LayoutPreset = Exclude<WebcamPositionPreset, "custom">;

export interface CameraLayoutDef {
	id: string;
	label: string;
	preset: LayoutPreset;
	size: number;
	cornerRadius: number;
	aspectRatio: number;
	margin: number;
	isActive: (webcam: WebcamOverlaySettings | undefined, preset: WebcamPositionPreset) => boolean;
	svg: React.ReactNode;
}

export interface CameraLayoutPanelProps {
	webcam: WebcamOverlaySettings | undefined;
	webcamPositionPreset: WebcamPositionPreset;
	onApplyLayout: (preset: LayoutPreset, size: number, cornerRadius: number, aspectRatio: number, margin: number) => void;
}

const W = 64;
const H = 38;

function ScreenLines({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
	return (
		<>
			<rect x={x + w * 0.12} y={y + h * 0.22} width={w * 0.6} height={1.5} rx={0.75} fill="rgba(255,255,255,0.08)" />
			<rect x={x + w * 0.12} y={y + h * 0.22 + 4} width={w * 0.42} height={1.2} rx={0.6} fill="rgba(255,255,255,0.05)" />
			<rect x={x + w * 0.12} y={y + h * 0.22 + 7.5} width={w * 0.52} height={1.2} rx={0.6} fill="rgba(255,255,255,0.05)" />
		</>
	);
}

function CamPerson({ cx, cy, headR }: { cx: number; cy: number; headR: number }) {
	return (
		<>
			<circle cx={cx} cy={cy - headR * 0.8} r={headR} fill="rgba(255,255,255,0.65)" />
			<path
				d={`M ${cx - headR * 2.2} ${cy + headR * 3.5} C ${cx - headR * 1.2} ${cy + headR * 1.4} ${cx - headR * 0.4} ${cy + headR * 1.0} ${cx} ${cy + headR * 0.8} C ${cx + headR * 0.4} ${cy + headR * 1.0} ${cx + headR * 1.2} ${cy + headR * 1.4} ${cx + headR * 2.2} ${cy + headR * 3.5} Z`}
				fill="rgba(255,255,255,0.42)"
			/>
		</>
	);
}

const CAM_BG_A = "#6d28d9";
const CAM_BG_B = "#4c1d95";
const SCREEN_BG = "#0d0f1a";
const SCREEN_CONTENT = "#111827";

function makeCamGradientId(id: string) {
	return `cam-grad-${id}`;
}

function CamBox({
	x, y, w, h, rx = 2, id,
}: {
	x: number; y: number; w: number; h: number; rx?: number; id: string;
}) {
	const gId = makeCamGradientId(id);
	const cx = x + w / 2;
	const cy = y + h / 2;
	const headR = Math.min(w, h) * 0.175;
	return (
		<>
			<defs>
				<linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={CAM_BG_A} />
					<stop offset="100%" stopColor={CAM_BG_B} />
				</linearGradient>
				<clipPath id={`clip-${id}`}>
					<rect x={x} y={y} width={w} height={h} rx={rx} />
				</clipPath>
			</defs>
			<rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${gId})`} />
			<rect x={x} y={y + h * 0.68} width={w} height={h * 0.32} fill="rgba(0,0,0,0.28)" />
			<g clipPath={`url(#clip-${id})`}>
				<CamPerson cx={cx} cy={cy} headR={headR} />
			</g>
			<rect x={x} y={y} width={w} height={h} rx={rx} fill="none" stroke="rgba(139,92,246,0.55)" strokeWidth={0.7} />
		</>
	);
}

function CamCircle({ cx, cy, r, id }: { cx: number; cy: number; r: number; id: string }) {
	const gId = makeCamGradientId(id);
	return (
		<>
			<defs>
				<linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={CAM_BG_A} />
					<stop offset="100%" stopColor={CAM_BG_B} />
				</linearGradient>
				<clipPath id={`clip-${id}`}>
					<circle cx={cx} cy={cy} r={r} />
				</clipPath>
			</defs>
			<circle cx={cx} cy={cy} r={r} fill={`url(#${gId})`} />
			<circle cx={cx} cy={cy + r * 0.65} r={r * 0.9} fill="rgba(0,0,0,0.25)" />
			<g clipPath={`url(#clip-${id})`}>
				<CamPerson cx={cx} cy={cy} headR={r * 0.26} />
			</g>
			<circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(139,92,246,0.55)" strokeWidth={0.7} />
		</>
	);
}

export const CAMERA_LAYOUTS: LayoutDef[] = [
	{
		id: "top-left-overlay",
		label: "Top Left",
		preset: "top-left" as LayoutPreset,
		size: 24,
		cornerRadius: 12,
		aspectRatio: 16 / 9,
		margin: 16,
		isActive: (w, p) =>
			p === "top-left" && (w?.size ?? 25) < 50 && (w?.webcamAspectRatio ?? 1) >= 1.5,
		svg: (
			<svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
				<rect width={W} height={H} fill={SCREEN_BG} />
				<rect x={0} y={0} width={W} height={H} fill={SCREEN_CONTENT} rx={0} />
				<ScreenLines x={14} y={2} w={46} h={H} />
				<CamBox x={2} y={2} w={18} h={10.5} rx={2} id="l1" />
			</svg>
		),
	},
	{
		id: "left-split",
		label: "Left Side",
		preset: "top-left" as LayoutPreset,
		size: 100,
		cornerRadius: 0,
		aspectRatio: 8 / 9,
		margin: 0,
		isActive: (w, p) =>
			(p === "top-left" || p === "center-left") &&
			(w?.size ?? 25) >= 70 &&
			(w?.webcamAspectRatio ?? 1) >= 0.75 &&
			(w?.webcamAspectRatio ?? 1) < 1.1 &&
			(w?.cornerRadius ?? 18) < 20,
		svg: (
			<svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
				<rect width={W} height={H} fill={SCREEN_BG} />
				<rect x={0} y={0} width={W} height={H} fill={SCREEN_CONTENT} />
				<ScreenLines x={22} y={2} w={38} h={H} />
				<CamBox x={0} y={0} w={20} h={H} rx={0} id="l2" />
				<rect x={20} y={0} width={0.8} height={H} fill="rgba(255,255,255,0.06)" />
			</svg>
		),
	},
	{
		id: "right-split",
		label: "Right Side",
		preset: "top-right" as LayoutPreset,
		size: 100,
		cornerRadius: 0,
		aspectRatio: 8 / 9,
		margin: 0,
		isActive: (w, p) =>
			(p === "top-right" || p === "center-right") &&
			(w?.size ?? 25) >= 70 &&
			(w?.webcamAspectRatio ?? 1) >= 0.75 &&
			(w?.webcamAspectRatio ?? 1) < 1.1 &&
			(w?.cornerRadius ?? 18) < 20,
		svg: (
			<svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
				<rect width={W} height={H} fill={SCREEN_BG} />
				<rect x={0} y={0} width={W} height={H} fill={SCREEN_CONTENT} />
				<ScreenLines x={2} y={2} w={38} h={H} />
				<rect x={W - 20.8} y={0} width={0.8} height={H} fill="rgba(255,255,255,0.06)" />
				<CamBox x={W - 20} y={0} w={20} h={H} rx={0} id="l3" />
			</svg>
		),
	},
	{
		id: "bottom-left-circle",
		label: "Bottom Left",
		preset: "bottom-left" as LayoutPreset,
		size: 22,
		cornerRadius: 160,
		aspectRatio: 1,
		margin: 16,
		isActive: (w, p) => p === "bottom-left" && (w?.cornerRadius ?? 18) >= 100,
		svg: (
			<svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
				<rect width={W} height={H} fill={SCREEN_BG} />
				<rect x={0} y={0} width={W} height={H} fill={SCREEN_CONTENT} />
				<ScreenLines x={14} y={2} w={46} h={H} />
				<CamCircle cx={9} cy={H - 8} r={6.5} id="l4" />
			</svg>
		),
	},
	{
		id: "bottom-center",
		label: "Bottom Center",
		preset: "bottom-center" as LayoutPreset,
		size: 20,
		cornerRadius: 24,
		aspectRatio: 4.5,
		margin: 16,
		isActive: (w, p) => p === "bottom-center" && (w?.webcamAspectRatio ?? 1) >= 2,
		svg: (
			<svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
				<rect width={W} height={H} fill={SCREEN_BG} />
				<rect x={0} y={0} width={W} height={H} fill={SCREEN_CONTENT} />
				<ScreenLines x={2} y={2} w={W - 4} h={H - 14} />
				<CamBox x={5} y={H - 11} w={W - 10} h={9} rx={3} id="l5" />
			</svg>
		),
	},
	{
		id: "bottom-right-circle",
		label: "Bottom Right",
		preset: "bottom-right" as LayoutPreset,
		size: 22,
		cornerRadius: 160,
		aspectRatio: 1,
		margin: 16,
		isActive: (w, p) => p === "bottom-right" && (w?.cornerRadius ?? 18) >= 100,
		svg: (
			<svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
				<rect width={W} height={H} fill={SCREEN_BG} />
				<rect x={0} y={0} width={W} height={H} fill={SCREEN_CONTENT} />
				<ScreenLines x={2} y={2} w={48} h={H} />
				<CamCircle cx={W - 9} cy={H - 8} r={6.5} id="l6" />
			</svg>
		),
	},
];

type LayoutDef = Omit<CameraLayoutDef, "svg"> & {
	isActive: (webcam: WebcamOverlaySettings | undefined, preset: WebcamPositionPreset) => boolean;
	svg: React.ReactNode;
};

export function CameraLayoutPanel({ webcam, webcamPositionPreset, onApplyLayout }: CameraLayoutPanelProps) {
	return (
		<div className="grid grid-cols-3 gap-1.5">
			{CAMERA_LAYOUTS.map((layout) => {
				const isActive = layout.isActive(webcam, webcamPositionPreset);
				return (
					<button
						key={layout.id}
						type="button"
						onClick={() =>
							onApplyLayout(
								layout.preset,
								layout.size,
								layout.cornerRadius,
								layout.aspectRatio,
								layout.margin,
							)
						}
						title={layout.label}
						className={cn(
							"group relative flex flex-col items-center gap-1 rounded-xl border p-1 pb-1.5 transition-all duration-150 cursor-pointer",
							"hover:scale-[1.04] active:scale-[0.97]",
							isActive
								? "border-violet-500/60 bg-violet-500/[0.10] shadow-[0_0_14px_rgba(139,92,246,0.25)]"
								: "border-foreground/[0.08] bg-foreground/[0.03] hover:border-foreground/[0.18] hover:bg-foreground/[0.06]",
						)}
					>
						<div
							className={cn(
								"w-full overflow-hidden rounded-lg transition-all duration-150",
								isActive
									? "ring-1 ring-violet-500/40"
									: "ring-1 ring-foreground/[0.05] group-hover:ring-foreground/[0.12]",
							)}
						>
							{layout.svg}
						</div>
						<span
							className={cn(
								"text-[7.5px] font-medium leading-tight text-center transition-colors",
								isActive
									? "text-violet-400"
									: "text-muted-foreground/50 group-hover:text-muted-foreground/75",
							)}
						>
							{layout.label}
						</span>
						{isActive && (
							<span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_5px_rgba(139,92,246,0.9)]" />
						)}
					</button>
				);
			})}
		</div>
	);
}
