export default function EndScreen({ message, onGoToLogin }) {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, fontFamily: "system-ui", textAlign: "center" }}>
            <h1 style={{ margin: 0 }}>{message}</h1>
            <button onClick={onGoToLogin} style={{ marginTop: 24, padding: "12px 16px", fontSize: 18, borderRadius: 12, border: "1px solid #ddd", cursor: "pointer", color: "#fff", width: "min(360px, 100%" }}>Back to Login</button>
        </div>
    );
}
