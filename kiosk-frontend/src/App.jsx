import { useEffect, useMemo, useState } from "react";
import { login, getStatus, play } from "./api";
import LoginScreen from "./screens/LoginScreen";
import GameScreen from "./screens/GameScreen";
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
            <LoginScreen
                playerId={playerId}
                setPlayerId={setPlayerId}
                loading={loading}
                error={error}
                onLogin={handleLogin}
                logoSrc={logo}
            />
        );
    }

    const canPlay = playsRemaining > 0 && (sessionExpiresAtUtc == null || sessionActive);

    return (
        <GameScreen
            activePlayerId={activePlayerId}
            playsRemaining={playsRemaining}
            countdownText={countdownText}
            canPlay={canPlay}
            loading={loading}
            result={result}
            error={error}
            scratchReset={scratchReset}
            onLogout={handleLogout}
            onRevealPlay={async () => {
                if (!result) {
                    await handlePlay();
                }
            }}
            onNextScratch={() => {
                setResult(null);
                setError(null);
                setScratchReset((n) => n + 1);
            }}
        />
    );
}
