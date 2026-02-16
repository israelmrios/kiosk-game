import { useEffect, useMemo, useState } from "react";
import { login, getStatus, play } from "./api";
import ScratchCard from "./components/ScratchCard";
import logo from "./assets/pechanga-logo.webp";

function formatCountdown(ms) {
    if (ms <= 0) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${m}:${s}`;
}

export default function App() {
    const [playerId, setPlayerId] = useState("");
    const [activePlayerId, setActivePlayerId] = useState(null);

    const [playsRemaining, setPlaysRemaining] = useState(0);
    const [sessionExpiresAtUtc, setSessionExpiresAtUtc] = useState(null);

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [scratchReset, setScratchReset] = useState(0);

    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 250);
        return () => clearInterval(t);
    }, []);

    const remainingMs = useMemo(() => {
        if (!sessionExpiresAtUtc) return null;
        const expires = Date.parse(sessionExpiresAtUtc);
        return expires - now;
    }, [sessionExpiresAtUtc, now]);

    const countdownText = useMemo(() => {
        if (remainingMs == null) return null;
        return formatCountdown(remainingMs);
    }, [remainingMs]);

    const sessionActive = remainingMs != null && remainingMs > 0;

    async function handleLogin(e) {
        e.preventDefault();
        setError(null);
        setResult(null);
        setLoading(true);

        try {
            const data = await login(playerId.trim());
            setActivePlayerId(playerId.trim());
            setPlaysRemaining(data.playsRemaining ?? 0);

            if (data.sessionExpiresAtUtc !== undefined) {
                setSessionExpiresAtUtc(data.sessionExpiresAtUtc);
            } else {
                const status = await getStatus(playerId.trim());
                setSessionExpiresAtUtc(status.sessionExpiresAtUtc ?? null);
                setPlaysRemaining(status.playsRemaining ?? data.playsRemaining ?? 0);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handlePlay() {
        if (!activePlayerId) return;
        setError(null);
        setResult(null);
        setLoading(true);

        try {
            const data = await play(activePlayerId);
            setResult({ outcome: data.outcome, prize: data.prize });
            setPlaysRemaining(data.playsRemaining ?? 0);
            setSessionExpiresAtUtc(data.sessionExpiresAtUtc ?? null);
        } catch (err) {
            setError(err.message);

            try {
                const status = await getStatus(activePlayerId);
                setPlaysRemaining(status.playsRemaining ?? 0);
                setSessionExpiresAtUtc(status.sessionExpiresAtUtc ?? null);
            } catch (_) { }
        } finally {
            setLoading(false);
        }
    }

    function handleLogout() {
        setPlayerId("");
        setActivePlayerId(null);
        setPlaysRemaining(0);
        setSessionExpiresAtUtc(null);
        setResult(null);
        setError(null);
        setLoading(false);
    }

    if (!activePlayerId) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <img src={logo} alt="Pechanga Resort Casino" style={{ width: 400, maxWidth: "80%", marginBottom: 12 }} />
                <h1 style={{ marginTop: 0 }}>Scratch-to-Win</h1>
                <form onSubmit={handleLogin}>
                    <label>
                        <input value={playerId} onChange={(e) => setPlayerId(e.target.value)} style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }} placeholder="Enter Rewards Number" />
                    </label>
                    <button type="submit" disabled={loading || !playerId.trim()} style={{ margin: 16, padding: 12, fontSize: 18, width: "100%" }}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {error && <p style={{ color: "crimson", marginTop: 16, textAlign: "center" }}>{error}</p>}
            </div>
        );
    }

    const canPlay = playsRemaining > 0 && (sessionExpiresAtUtc == null || sessionActive);

    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", paddingTop: "60px 20px" }}>
            <button onClick={handleLogout} style={{ position: "fixed", top: 16, right: 16, padding: "10px 14px", fontSize: 16, borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer", zIndex: 1000, color: "black" }}>Logout</button>
            <div style={{ width: "100%", maxWidth: 1000, fontFamily: "system-ui", display: "flex", alignItems: "center" }}>
                <div style={{ padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h1 style={{ margin: "10px 0" }}>Welcome, {activePlayerId}</h1>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-around", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12, minWidth: 220, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ fontSize: 14, opacity: 0.7 }}>Plays Remaining</div>
                            <div style={{ fontSize: 40, fontWeight: 700 }}>{playsRemaining}</div>
                        </div>

                        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12, minWidth: 220, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ fontSize: 14, opacity: 0.7 }}>Session Timer</div>
                            <div style={{ fontSize: 40, fontWeight: 700 }}>{countdownText ?? "--:--"}</div>
                            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>Starts after your first play</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 24, padding: 24, border: "1px solid #ddd", borderRadius: 16 }}>
                        <h2 style={{ textAlign: "center" }}>Scratch-to-Win</h2>
                        <p style={{ opacity: 0.8, textAlign: "center" }}>May the odds be ever in your favor!</p>

                        <ScratchCard width={720} height={240} disabled={loading || !canPlay} prizeText={result ? (result.prize ? result.prize.name : "No Prize") : "???"} resetSignal={scratchReset} onReveal={async () => { if (!result) { await handlePlay(); }}} />

                        {result && playsRemaining > 0 && (
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setError(null);
                                    setScratchReset((n) => n + 1);
                                }}
                                style={{
                                    marginTop: 12,
                                    padding: 14,
                                    fontSize: 18,
                                    width: "100%",
                                    borderRadius: 12,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    cursor: "pointer",
                                    color: "black",
                                }}
                            >
                                Play Next Scratch
                            </button>
                        )}

                        {/*<button onClick={handlePlay} disabled={loading || !canPlay} style={{ marginTop: 12, padding: 14, fontSize: 20, width: "100%" }}>*/}
                        {/*    {loading ? "Playing..." : "SCRATCH / PLAY"}*/}
                        {/*</button>*/}

                        {!canPlay && (
                            <p style={{ color: "crimson", marginTop: 12, textAlign: "center" }}>
                                {playsRemaining <= 0
                                    ? "No plays remaining."
                                    : "Session expired. Remaining plays were lost."}
                            </p>
                        )}
                    </div>

                    {error && <p style={{ color: "crimson", marginTop: 16, textAlign: "center" }}>{error}</p>}
                </div>
            </div>
        </div>
    );
}
