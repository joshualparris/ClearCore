import React, { useEffect } from "react";

function createConfetti(count = 20) {
  const emojis = ["🎉", "✨", "🎈", "💜", "😄", "🥳"];
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "0";
  container.style.top = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.overflow = "hidden";
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.position = "absolute";
    el.style.left = Math.random() * 100 + "%";
    el.style.top = "-10vh";
    el.style.fontSize = 12 + Math.random() * 28 + "px";
    el.style.opacity = String(0.9 - Math.random() * 0.3);
    const dur = 2000 + Math.random() * 3000;
    el.style.transition = `transform ${dur}ms cubic-bezier(.2,.8,.2,1), opacity ${dur}ms`;
    const rotate = Math.random() * 720;
    const x = (Math.random() - 0.5) * 40; // horizontal drift
    setTimeout(() => {
      el.style.transform = `translate(${x}vw, 110vh) rotate(${rotate}deg)`;
      el.style.opacity = "0.9";
    }, 50 + Math.random() * 200);
    container.appendChild(el);
  }

  setTimeout(() => container.remove(), 7000);
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    setTimeout(() => { o.stop(); ctx.close().catch(()=>{}); }, 400);
  } catch (e) {
    // ignore audio failures
  }
}

function showBadge(name = "Fun Unlocked") {
  const el = document.createElement("div");
  el.textContent = name;
  el.style.position = "fixed";
  el.style.right = "20px";
  el.style.bottom = "20px";
  el.style.padding = "10px 14px";
  el.style.background = "linear-gradient(90deg,#ffd6e0,#d6f0ff)";
  el.style.borderRadius = "12px";
  el.style.boxShadow = "0 8px 24px rgba(2,6,23,0.12)";
  el.style.zIndex = "9999";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

export default function FunControls() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "c" || e.key === "C") createConfetti(30);
      if (e.key === "b" || e.key === "B") playBeep();
      if (e.key === "k" || e.key === "K") showBadge("Badge: Keyboard Explorer");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ position: "fixed", right: 18, bottom: 18, zIndex: 9998 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => createConfetti(40)}
          aria-label="Throw confetti"
          style={{ padding: "8px 12px", borderRadius: 10, border: 0, background: "#7c3aed", color: "white", cursor: "pointer" }}
        >
          🎉
        </button>
        <button
          onClick={() => playBeep()}
          aria-label="Play beep"
          style={{ padding: "8px 12px", borderRadius: 10, border: 0, background: "#06b6d4", color: "white", cursor: "pointer" }}
        >
          🔊
        </button>
        <button
          onClick={() => showBadge("Manual Badge")}
          aria-label="Show badge"
          style={{ padding: "8px 12px", borderRadius: 10, border: 0, background: "#f97316", color: "white", cursor: "pointer" }}
        >
          🏅
        </button>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#334155", textAlign: "right" }}>Keys: C · B · K</div>
    </div>
  );
}
