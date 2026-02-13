const API_BASE = "http://localhost:5298";

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    });

    let data = null;
    const text = await res.text();
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!res.ok) {
        const message = (data && typeof data === "object" && (data.message || data.error)) || (typeof data === "string" ? data : "") || res.statusText;

        throw new Error(message);
    }

    return data;
}

export function login(playerId) {
    return request("/api/player/login", {
        method: "POST",
        body: JSON.stringify({ playerId }),
    });
}

export function getStatus(playerId) {
    return request(`/api/player/${encodeURIComponent(playerId)}/status`);
}

export function play(playerId) {
    return request("/api/game/play", {
        method: "POST",
        body: JSON.stringify({ playerId }),
    });
}
