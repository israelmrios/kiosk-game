import ScratchCard from "../components/ScratchCard";

export default function GameScreen({ activePlayerId, playsRemaining, countdownText, canPlay, loading, result, error, onLogout, onRevealPlay, onNextScratch, scratchReset, }) {
    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center" }}>
            <button onClick={onLogout} style={{ position: "fixed", top: 16, right: 16, padding: "10px 14px", fontSize: 16, borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer", zIndex: 1000, color: "black" }}>Logout</button>
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

                        <ScratchCard width={720} height={240} disabled={loading || !canPlay} prizeText={result ? (result.prize ? result.prize.name : "No Prize") : "???"} resetSignal={scratchReset} onReveal={onRevealPlay} />

                        {result && playsRemaining > 0 && (
                            <button
                                onClick={onNextScratch}
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
    )
}
