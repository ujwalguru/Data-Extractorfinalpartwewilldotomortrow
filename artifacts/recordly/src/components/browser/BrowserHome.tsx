import { useCallback, useRef, useState } from "react";
import { setBrowserVideo } from "@/browserVideoStore";

const ACCEPTED = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska", "video/avi"];
const ACCEPT_EXT = ".mp4,.webm,.mov,.mkv,.avi";

interface BrowserHomeProps {
	onVideoReady: () => void;
	onTryDemo: () => void;
}

const FEATURES = [
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
				<path d="M11 8v6M8 11h6" />
			</svg>
		),
		title: "Auto-Zoom",
		desc: "Intelligently zooms into key moments — clicks, keypresses, and cursor activity — with smooth, cinematic transitions.",
	},
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
				<circle cx="12" cy="12" r="3" />
				<path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
			</svg>
		),
		title: "Cursor Effects",
		desc: "Polish your cursor with spotlight, click highlights, size scaling, and smooth motion — make every interaction shine.",
	},
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<path d="M3 9h18M9 21V9" />
			</svg>
		),
		title: "Styled Backgrounds",
		desc: "Choose from beautiful gradient wallpapers, solid colors, or upload your own custom background image or video.",
	},
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" />
			</svg>
		),
		title: "Webcam Overlay",
		desc: "Add a floating webcam bubble with customizable size, position, and shape to put a face to your recordings.",
	},
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M3 6h18M3 12h18M3 18h18" />
			</svg>
		),
		title: "Timeline Editor",
		desc: "Drag-and-drop timeline trimming, speed regions, text annotations, and figure overlays in a non-destructive workflow.",
	},
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="7 10 12 15 17 10" />
				<line x1="12" y1="15" x2="12" y2="3" />
			</svg>
		),
		title: "One-Click Export",
		desc: "Export to high-quality MP4 with hardware acceleration. Share a link or save locally — entirely offline, zero uploads.",
	},
];

const STEPS = [
	{ num: "01", title: "Upload your recording", desc: "Drop an MP4, WebM, MOV, MKV, or AVI file directly into the editor. No account, no waiting." },
	{ num: "02", title: "Polish the details", desc: "Add backgrounds, trim the timeline, refine cursor effects, and set up auto-zoom regions." },
	{ num: "03", title: "Export & share", desc: "One-click export to a production-ready video file. Fully local — your footage never leaves your machine." },
];

export function BrowserHome({ onVideoReady, onTryDemo }: BrowserHomeProps) {
	const [dragging, setDragging] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const uploadRef = useRef<HTMLDivElement>(null);

	const handleFile = useCallback(
		(file: File) => {
			if (!ACCEPTED.includes(file.type) && !ACCEPT_EXT.split(",").some((ext) => file.name.toLowerCase().endsWith(ext))) {
				setError("Unsupported format. Please upload an MP4, WebM, MOV, MKV, or AVI.");
				return;
			}
			setError(null);
			setBrowserVideo(file);
			onVideoReady();
		},
		[onVideoReady],
	);

	const onDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) handleFile(file);
		},
		[handleFile],
	);

	const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true); }, []);
	const onDragLeave = useCallback(() => setDragging(false), []);
	const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	}, [handleFile]);

	const scrollToUpload = useCallback(() => {
		uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
	}, []);

	return (
		<div
			className="relative min-h-full w-full overflow-y-auto text-white"
			style={{ background: "#080604" }}
		>
			{/* Ambient glow blobs — warm brown only */}
			<div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
				<div style={{
					position: "absolute", top: "-20%", left: "10%",
					width: 600, height: 600, borderRadius: "50%",
					background: "radial-gradient(circle, rgba(160,103,58,0.18) 0%, transparent 70%)",
					filter: "blur(40px)",
				}} />
				<div style={{
					position: "absolute", bottom: "10%", right: "5%",
					width: 500, height: 500, borderRadius: "50%",
					background: "radial-gradient(circle, rgba(138,85,48,0.10) 0%, transparent 70%)",
					filter: "blur(60px)",
				}} />
				<div style={{
					position: "absolute", top: "40%", left: "50%",
					width: 700, height: 400, borderRadius: "50%",
					transform: "translateX(-50%)",
					background: "radial-gradient(ellipse, rgba(160,103,58,0.08) 0%, transparent 70%)",
					filter: "blur(50px)",
				}} />
			</div>

			{/* NAV */}
			<nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4" style={{
				background: "rgba(8,6,4,0.8)",
				backdropFilter: "blur(16px)",
				borderBottom: "1px solid rgba(255,255,255,0.06)",
			}}>
				<div className="flex items-center gap-3">
					<img src="/app-icons/recordly-128.png" alt="Recordly" className="h-8 w-8 rounded-lg" />
					<span className="text-lg font-bold tracking-tight">Recordly</span>
				</div>
				<div className="hidden sm:flex items-center gap-8 text-sm text-white/60">
					<a href="#features" className="hover:text-white transition-colors">Features</a>
					<a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
					<a
						href="https://github.com/webadderallorg/Recordly"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-white transition-colors"
					>
						GitHub
					</a>
				</div>
				<button
					type="button"
					onClick={scrollToUpload}
					className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
					style={{ background: "linear-gradient(135deg, #a0673a, #8a5530)" }}
				>
					Open Editor
				</button>
			</nav>

			{/* HERO */}
			<section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
				<div className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium" style={{
					background: "rgba(160,103,58,0.12)",
					borderColor: "rgba(160,103,58,0.35)",
					color: "#dbb08a",
				}}>
					<span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#c8906a" }} />
					Open-source · Fully local · No account needed
				</div>

				<h1 className="max-w-3xl text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
					Screen recordings that{" "}
					<span style={{
						background: "linear-gradient(90deg, #c8906a 0%, #e8b882 50%, #a0673a 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
					}}>
						look professional
					</span>
				</h1>

				<p className="max-w-xl text-lg text-white/55 mb-10 leading-relaxed">
					Auto-zoom, cursor effects, styled backgrounds, webcam overlays, and timeline editing —
					all in a beautiful editor that runs entirely in your browser.
				</p>

				<div className="flex flex-col sm:flex-row items-center gap-4">
					<button
						type="button"
						onClick={scrollToUpload}
						className="flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-2xl transition-all hover:opacity-90 active:scale-95"
						style={{
							background: "linear-gradient(135deg, #a0673a 0%, #8a5530 100%)",
							boxShadow: "0 0 40px rgba(160,103,58,0.4)",
						}}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
						Upload a Video
					</button>
					<button
						type="button"
						onClick={onTryDemo}
						className="flex items-center gap-2 rounded-xl border px-8 py-3.5 text-base font-semibold text-white/80 transition-all hover:bg-white/5 hover:text-white active:scale-95"
						style={{ borderColor: "rgba(255,255,255,0.15)" }}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polygon points="5 3 19 12 5 21 5 3" />
						</svg>
						Try Demo
					</button>
				</div>

				{/* Hero mockup */}
				<div className="relative mt-16 w-full max-w-4xl mx-auto rounded-2xl overflow-hidden" style={{
					border: "1px solid rgba(255,255,255,0.08)",
					background: "rgba(255,255,255,0.02)",
					backdropFilter: "blur(12px)",
					boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(160,103,58,0.15)",
				}}>
					{/* Fake editor chrome */}
					<div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.4)" }}>
						<span className="h-3 w-3 rounded-full" style={{ background: "#ef4444" }} />
						<span className="h-3 w-3 rounded-full" style={{ background: "#f59e0b" }} />
						<span className="h-3 w-3 rounded-full" style={{ background: "#22c55e" }} />
						<span className="mx-auto text-xs text-white/30 font-medium">demo.recordly — Recordly Editor</span>
					</div>
					<div className="flex items-center justify-center" style={{ height: 220, background: "#0d0a07" }}>
						<div className="text-center">
							<div className="flex items-center justify-center gap-3 mb-3">
								<img src="/app-icons/recordly-128.png" alt="" className="h-10 w-10 rounded-xl opacity-80" />
								<span className="text-xl font-bold text-white/80">Recordly Editor</span>
							</div>
							<p className="text-sm text-white/30">Drop a video to get started</p>
						</div>
					</div>
					{/* Fake timeline */}
					<div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
						<div className="flex items-center gap-3 mb-2">
							<div className="h-6 w-6 rounded flex items-center justify-center" style={{ background: "rgba(160,103,58,0.3)" }}>
								<svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
							</div>
							<div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
								<div className="h-full w-1/3 rounded-full" style={{ background: "linear-gradient(90deg, #a0673a, #c8906a)" }} />
							</div>
							<span className="text-xs text-white/30">0:00 / 0:05</span>
						</div>
						<div className="h-7 rounded-lg w-full" style={{ background: "rgba(160,103,58,0.2)", border: "1px solid rgba(160,103,58,0.3)" }}>
							<div className="flex items-center h-full px-3 gap-2">
								<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(200,144,106,0.6)" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
								<span className="text-xs" style={{ color: "rgba(200,144,106,0.5)" }}>Clip</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FEATURES */}
			<section id="features" className="px-6 py-20 max-w-6xl mx-auto">
				<div className="text-center mb-14">
					<p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#c8906a" }}>Features</p>
					<h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to ship<br />polished recordings</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{FEATURES.map((f) => (
						<div
							key={f.title}
							className="rounded-2xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
							style={{
								background: "rgba(255,255,255,0.03)",
								border: "1px solid rgba(255,255,255,0.07)",
								backdropFilter: "blur(12px)",
							}}
						>
							<div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(160,103,58,0.2)", color: "#c8906a" }}>
								{f.icon}
							</div>
							<div>
								<h3 className="font-semibold text-base mb-1">{f.title}</h3>
								<p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* HOW IT WORKS */}
			<section id="how-it-works" className="px-6 py-20" style={{ background: "rgba(160,103,58,0.04)" }}>
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-14">
						<p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#c8906a" }}>How it works</p>
						<h2 className="text-3xl sm:text-4xl font-bold tracking-tight">From raw recording to polished video<br />in minutes</h2>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
						{STEPS.map((s) => (
							<div key={s.num} className="flex flex-col items-center text-center gap-4">
								<div
									className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black"
									style={{
										background: "linear-gradient(135deg, rgba(160,103,58,0.25), rgba(100,60,25,0.15))",
										border: "1px solid rgba(160,103,58,0.35)",
										color: "#c8906a",
									}}
								>
									{s.num}
								</div>
								<div>
									<h3 className="font-semibold text-base mb-2">{s.title}</h3>
									<p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* UPLOAD SECTION */}
			<section className="px-6 py-20 max-w-3xl mx-auto" ref={uploadRef as React.RefObject<HTMLDivElement>}>
				<div className="text-center mb-10">
					<p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#c8906a" }}>Get started</p>
					<h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Ready to try it?</h2>
					<p className="text-white/50 text-base">Drop your video below — no account, no upload, 100% local.</p>
				</div>

				<div
					role="button"
					tabIndex={0}
					aria-label="Upload a video file"
					onClick={() => inputRef.current?.click()}
					onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
					onDrop={onDrop}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}
					className="relative flex w-full cursor-pointer flex-col items-center justify-center gap-6 rounded-2xl px-8 py-16 transition-all duration-200 select-none"
					style={{
						background: dragging ? "rgba(160,103,58,0.15)" : "rgba(255,255,255,0.02)",
						border: `2px dashed ${dragging ? "rgba(160,103,58,0.7)" : "rgba(255,255,255,0.12)"}`,
						backdropFilter: "blur(16px)",
						boxShadow: dragging ? "0 0 40px rgba(160,103,58,0.25) inset" : undefined,
						transform: dragging ? "scale(1.01)" : undefined,
					}}
				>
					<div
						className="flex h-20 w-20 items-center justify-center rounded-2xl"
						style={{
							background: dragging ? "rgba(160,103,58,0.3)" : "rgba(160,103,58,0.15)",
							border: "1px solid rgba(160,103,58,0.3)",
							color: "#c8906a",
							transition: "all 0.2s",
						}}
					>
						<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
					</div>

					<div className="text-center">
						<p className="text-xl font-bold mb-1">
							{dragging ? "Drop to open in editor" : "Drop your video here"}
						</p>
						<p className="text-sm text-white/40">
							or click to browse &nbsp;·&nbsp; MP4 · WebM · MOV · MKV · AVI
						</p>
					</div>

					<button
						type="button"
						onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
						className="rounded-xl px-8 py-3 text-base font-bold text-white shadow-2xl transition-all hover:opacity-90 active:scale-95"
						style={{
							background: "linear-gradient(135deg, #a0673a 0%, #8a5530 100%)",
							boxShadow: "0 0 30px rgba(160,103,58,0.4)",
						}}
					>
						Choose File
					</button>

					{error && (
						<p className="absolute bottom-4 text-sm text-red-400">{error}</p>
					)}
				</div>

				<p className="mt-6 text-center text-sm text-white/30">
					No video yet?{" "}
					<button
						type="button"
						onClick={onTryDemo}
						className="transition-colors underline underline-offset-2"
						style={{ color: "#c8906a" }}
					>
						Try the demo clip
					</button>
				</p>
			</section>

			{/* FOOTER */}
			<footer className="border-t px-8 py-8 text-center text-sm text-white/25" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
				<div className="flex items-center justify-center gap-3 mb-3">
					<img src="/app-icons/recordly-128.png" alt="" className="h-5 w-5 rounded opacity-50" />
					<span className="font-semibold text-white/40">Recordly</span>
				</div>
				<p>Open-source screen recorder &amp; editor &nbsp;·&nbsp; Runs entirely in your browser &nbsp;·&nbsp; No data leaves your machine</p>
			</footer>

			<input
				ref={inputRef}
				type="file"
				accept={ACCEPT_EXT}
				className="sr-only"
				onChange={onInputChange}
				aria-hidden="true"
			/>
		</div>
	);
}
