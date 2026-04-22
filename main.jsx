import { useState, useEffect } from "react";

const MOCK_META_ACCOUNTS = [
  {
    id: "m1",
    name: "Café Atlas",
    platform: "meta",
    avatar: "CA",
    color: "#e8a87c",
    metrics: { reach: 12400, impressions: 38200, clicks: 890, spend: 245, ctr: 2.3, cpm: 6.4 },
    status: "active",
    campaigns: 3,
    trend: +18,
  },
  {
    id: "m2",
    name: "Riad Soleil",
    platform: "meta",
    avatar: "RS",
    color: "#7eb8d4",
    metrics: { reach: 8700, impressions: 21500, clicks: 540, spend: 180, ctr: 2.5, cpm: 8.4 },
    status: "active",
    campaigns: 2,
    trend: +7,
  },
  {
    id: "m3",
    name: "Pâtisserie Amina",
    platform: "meta",
    avatar: "PA",
    color: "#c9a96e",
    metrics: { reach: 5200, impressions: 14100, clicks: 320, spend: 95, ctr: 2.3, cpm: 6.7 },
    status: "paused",
    campaigns: 1,
    trend: -4,
  },
  {
    id: "m4",
    name: "Auto Prestige",
    platform: "meta",
    avatar: "AP",
    color: "#a8d8a8",
    metrics: { reach: 19800, impressions: 52300, clicks: 1240, spend: 410, ctr: 2.4, cpm: 7.8 },
    status: "active",
    campaigns: 5,
    trend: +32,
  },
];

const MOCK_GMB_ACCOUNTS = [
  {
    id: "g1",
    name: "Café Atlas",
    platform: "gmb",
    avatar: "CA",
    color: "#e8a87c",
    email: "cafeatlas@gmail.com",
    metrics: { views: 3200, searches: 1840, calls: 67, directions: 43, rating: 4.7, reviews: 124 },
    status: "verified",
    trend: +12,
  },
  {
    id: "g2",
    name: "Riad Soleil",
    platform: "gmb",
    avatar: "RS",
    color: "#7eb8d4",
    email: "riadsoleil@gmail.com",
    metrics: { views: 2100, searches: 980, calls: 31, directions: 89, rating: 4.9, reviews: 87 },
    status: "verified",
    trend: +5,
  },
  {
    id: "g3",
    name: "Pâtisserie Amina",
    platform: "gmb",
    avatar: "PA",
    color: "#c9a96e",
    email: "patisserie.amina@gmail.com",
    metrics: { views: 980, searches: 540, calls: 18, directions: 12, rating: 4.5, reviews: 41 },
    status: "pending",
    trend: +2,
  },
  {
    id: "g4",
    name: "Auto Prestige",
    platform: "gmb",
    avatar: "AP",
    color: "#a8d8a8",
    email: "autoprestige.agadir@gmail.com",
    metrics: { views: 5600, searches: 3200, calls: 142, directions: 198, rating: 4.6, reviews: 203 },
    status: "verified",
    trend: +21,
  },
];

const formatNum = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

const MetaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const GMBIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const TrendBadge = ({ value }) => {
  const style = {
    display: "inline-flex", alignItems: "center", gap: 3,
    fontSize: 11, fontWeight: 700,
    color: value >= 0 ? "#4ade80" : "#f87171",
    background: value >= 0 ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
    padding: "2px 7px", borderRadius: 20,
  };
  return (
    <span style={style}>
      {value >= 0 ? "▲" : "▼"} {Math.abs(value)}%
    </span>
  );
};

const StatusDot = ({ status }) => {
  const colors = { active: "#4ade80", paused: "#facc15", pending: "#fb923c", verified: "#4ade80" };
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: colors[status] || "#94a3b8",
      boxShadow: `0 0 6px ${colors[status] || "#94a3b8"}`,
    }} />
  );
};

const MetaCard = ({ acc, selected, onClick }) => (
  <div onClick={onClick} style={{
    background: selected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${selected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 16, padding: "18px 20px", cursor: "pointer",
    transition: "all 0.2s",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: acc.color, borderRadius: "16px 0 0 16px" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: acc.color + "33",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: acc.color, letterSpacing: 0.5,
        }}>{acc.avatar}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{acc.name}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{acc.campaigns} campagne{acc.campaigns > 1 ? "s" : ""}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <StatusDot status={acc.status} />
        <TrendBadge value={acc.trend} />
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {[
        { label: "Portée", val: formatNum(acc.metrics.reach) },
        { label: "Impressions", val: formatNum(acc.metrics.impressions) },
        { label: "Clics", val: formatNum(acc.metrics.clicks) },
        { label: "Dépense", val: acc.metrics.spend + "€" },
        { label: "CTR", val: acc.metrics.ctr + "%" },
        { label: "CPM", val: acc.metrics.cpm + "€" },
      ].map(m => (
        <div key={m.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>{m.label}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{m.val}</div>
        </div>
      ))}
    </div>
  </div>
);

const GMBCard = ({ acc, selected, onClick }) => (
  <div onClick={onClick} style={{
    background: selected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${selected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 16, padding: "18px 20px", cursor: "pointer",
    transition: "all 0.2s",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: acc.color, borderRadius: "16px 0 0 16px" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: acc.color + "33",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: acc.color, letterSpacing: 0.5,
        }}>{acc.avatar}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{acc.name}</div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{acc.email}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <StatusDot status={acc.status} />
        <TrendBadge value={acc.trend} />
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {[
        { label: "Vues", val: formatNum(acc.metrics.views) },
        { label: "Recherches", val: formatNum(acc.metrics.searches) },
        { label: "Appels", val: acc.metrics.calls },
        { label: "Itinéraires", val: acc.metrics.directions },
        { label: "Note", val: "⭐ " + acc.metrics.rating },
        { label: "Avis", val: acc.metrics.reviews },
      ].map(m => (
        <div key={m.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>{m.label}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{m.val}</div>
        </div>
      ))}
    </div>
  </div>
);

const SummaryBar = ({ metaAccounts, gmbAccounts }) => {
  const totalSpend = metaAccounts.reduce((s, a) => s + a.metrics.spend, 0);
  const totalReach = metaAccounts.reduce((s, a) => s + a.metrics.reach, 0);
  const totalCalls = gmbAccounts.reduce((s, a) => s + a.metrics.calls, 0);
  const avgRating = (gmbAccounts.reduce((s, a) => s + a.metrics.rating, 0) / gmbAccounts.length).toFixed(1);

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12, marginBottom: 28,
    }}>
      {[
        { label: "Portée totale Meta", val: formatNum(totalReach), icon: "📡", color: "#7eb8d4" },
        { label: "Dépense totale Meta", val: totalSpend + " €", icon: "💶", color: "#c9a96e" },
        { label: "Appels GMB total", val: totalCalls, icon: "📞", color: "#a8d8a8" },
        { label: "Note moyenne GMB", val: "⭐ " + avgRating, icon: "🌟", color: "#e8a87c" },
      ].map(s => (
        <div key={s.label} style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "16px 18px",
        }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.val}</div>
          <div style={{ fontSize: 11, color: "#475569" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(new Date());
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setPulse(p => !p);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const showMeta = tab === "all" || tab === "meta";
  const showGMB = tab === "all" || tab === "gmb";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e2e8f0",
      padding: "32px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4ade80", animation: "blink 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#4ade80", fontFamily: "'DM Mono'", letterSpacing: 1 }}>LIVE · {time.toLocaleTimeString("fr-FR")}</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", letterSpacing: -0.5 }}>Dashboard Clients</h1>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 3 }}>Vue centralisée — Meta Ads + Google My Business</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "meta", "gmb"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer",
              fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600,
              background: tab === t ? "#f8fafc" : "rgba(255,255,255,0.06)",
              color: tab === t ? "#080c14" : "#64748b",
              transition: "all 0.2s",
            }}>
              {t === "all" ? "Tout" : t === "meta" ? "Meta Ads" : "Google MB"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <SummaryBar metaAccounts={MOCK_META_ACCOUNTS} gmbAccounts={MOCK_GMB_ACCOUNTS} />

      {/* Sections */}
      {showMeta && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ color: "#1877f2", display: "flex" }}><MetaIcon /></div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" }}>Meta Ads</span>
            <span style={{ fontSize: 11, color: "#334155", fontFamily: "'DM Mono'" }}>via compte Facebook central</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontSize: 11, color: "#334155" }}>{MOCK_META_ACCOUNTS.length} comptes</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {MOCK_META_ACCOUNTS.map(acc => (
              <MetaCard key={acc.id} acc={acc}
                selected={selected === acc.id}
                onClick={() => setSelected(selected === acc.id ? null : acc.id)}
              />
            ))}
          </div>
        </div>
      )}

      {showGMB && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ color: "#34a853", display: "flex" }}><GMBIcon /></div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" }}>Google My Business</span>
            <span style={{ fontSize: 11, color: "#334155", fontFamily: "'DM Mono'" }}>comptes individuels</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontSize: 11, color: "#334155" }}>{MOCK_GMB_ACCOUNTS.length} comptes</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {MOCK_GMB_ACCOUNTS.map(acc => (
              <GMBCard key={acc.id} acc={acc}
                selected={selected === acc.id}
                onClick={() => setSelected(selected === acc.id ? null : acc.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#1e293b", fontFamily: "'DM Mono'" }}>Données simulées · Connectez vos APIs pour données réelles</span>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: pulse ? "#4ade80" : "#1e3a5f" }} />
          <span style={{ fontSize: 11, color: "#1e293b" }}>sync auto</span>
        </div>
      </div>
    </div>
  );
}
