import { useEffect, useRef, useState } from "react";

function ScratchCard({ width = 700, height = 200, onReveal, disabled, prizeText, resetSignal }) {
    const canvasRef = useRef(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isScratching, setIsScratching] = useState(false);

    function getCtx() {
        const canvas = canvasRef.current;
        return canvas ? canvas.getContext("2d", { willReadFrequently: true }) : null;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = getCtx();
        if (!canvas || !ctx) return;

        setIsRevealed(false);
        setIsScratching(false);

        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#c0c0c0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.font = "bold 28px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2);
    }, [resetSignal, width, height]);

    function getPoint(e) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function scratchAt(e) {
        const canvas = canvasRef.current;
        const ctx = getCtx();
        if (!canvas || !ctx) return;


        const { x, y } = getPoint(e);

        ctx.globalCompositeOperation = "destination-out";

        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
    }

    function estimateScratchedPercent() {
        const canvas = canvasRef.current;
        const ctx = getCtx();
        if (!canvas || !ctx) return 0;


        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let cleared = 0;
        const total = canvas.width * canvas.height;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            const farFromGray = Math.abs(r - 189) + Math.abs(g - 189) + Math.abs(b - 189) > 60;
            if (a < 200 || farFromGray) cleared++;
        }

        return cleared / total;
    }

    async function maybeReveal() {
        if (isRevealed) return;

        const pct = estimateScratchedPercent();
        console.log("scratch %", Math.round(pct * 100));

        if (pct >= 0.45) {
            console.log("REVEAL TRIGGERED");

            setIsRevealed(true);
            await onReveal?.();
            const canvas = canvasRef.current;
            const ctx = getCtx();
            if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    function onPointerDown(e) {
        if (disabled) return;
        e.preventDefault();
        setIsScratching(true);
        scratchAt(e);
    }

    async function onPointerMove(e) {
        if (disabled || !isScratching) return;
        e.preventDefault();
        scratchAt(e);
        await maybeReveal();
    }

    async function onPointerUp(e) {
        if (disabled) return;
        e.preventDefault();
        setIsScratching(false);
        await maybeReveal();
    }

    return (
        <div style={{ position: "relative", width, height, borderRadius: 16, overflow: "hidden", border: "1px solid #444", background: "#1f1f1f", }}>
            {/* Prize underneath */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, textAlign: "center", fontFamily: "system-ui", }}>
                <div>
                    <div style={{ fontSize: 12, opacity: 0.75, color: "#fff" }}>Your Prize</div>
                    <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6, color: "#fff" }}>{prizeText}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8, color: "#fff" }}>Scratch to reveal</div>
                </div>
            </div>
            {/* Scratch layer */}
            <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, touchAction: "none", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onPointerLeave={onPointerUp} />
        </div>
    );
}

export default ScratchCard;