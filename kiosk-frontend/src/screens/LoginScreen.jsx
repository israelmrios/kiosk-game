export default function LoginScreen({ playerId, setPlayerId, loading, error, onLogin, logoSrc }) {
    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", }} >
            {logoSrc && (<img src={logoSrc} alt="Pechanga Resort Casino" style={{ width: 400, maxWidth: "80%", marginBottom: 12 }} />)}
            <h1 style={{ marginTop: 0 }}>Scratch-to-Win</h1>
            <form onSubmit={onLogin}>
                <input value={playerId} onChange={(e) => setPlayerId(e.target.value)} style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8, boxSizing: "border-box" }} placeholder="Enter Rewards Number" />
                <button type="submit" disabled={loading || !playerId.trim()} style={{ marginTop: 16, padding: 12, fontSize: 18, width: "100%", boxSizing: "border-box" }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {error && <p style={{ color: "crimson", marginTop: 16, textAlign: "center" }}>{error}</p>}
        </div>
    )
}
