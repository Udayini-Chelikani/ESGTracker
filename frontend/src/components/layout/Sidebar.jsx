import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Client register", end: true },
  { to: "/add", label: "New transaction" },
  { to: "/anomalies", label: "Anomalies" },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        background: "var(--ink)",
        color: "var(--text)",
        padding: "28px 24px",
        borderRight: "1px solid var(--navy)",
      }}
    >
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            lineHeight: 1.2,
          }}
        >
          ESG Payment
          <br />
          Scanner
        </div>
        <div
          className="hint"
          style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 12 }}
        >
          BNP Paribas · INNOVERSITE 2025
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            style={({ isActive }) => ({
              padding: "10px 12px",
              fontSize: 14,
              textDecoration: "none",
              color: isActive ? "var(--gold-bright)" : "var(--text-muted)",
              background: isActive ? "var(--ink-soft)" : "transparent",
              borderLeft: isActive
                ? "2px solid var(--gold-bright)"
                : "2px solid transparent",
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
