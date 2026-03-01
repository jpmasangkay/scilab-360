import { Search } from "lucide-react"

interface TopNavProps {
  searchQuery:  string
  onSearch:     (q: string) => void
}

function MoleculeLogoSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Sci Lab 360 logo">
      <circle cx="16" cy="8"  r="5" fill="#00d4ff" opacity="0.9" filter="url(#glow)" />
      <circle cx="6"  cy="24" r="5" fill="#7c3aed" opacity="0.9" filter="url(#glow)" />
      <circle cx="26" cy="24" r="5" fill="#10b981" opacity="0.9" filter="url(#glow)" />
      <line x1="16" y1="13" x2="8"  y2="20" stroke="#00d4ff" strokeWidth="2" opacity="0.7" />
      <line x1="16" y1="13" x2="24" y2="20" stroke="#00d4ff" strokeWidth="2" opacity="0.7" />
      <line x1="9"  y1="26" x2="23" y2="26" stroke="#00d4ff" strokeWidth="2" opacity="0.7" />
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}

export function TopNav({ searchQuery, onSearch }: TopNavProps) {

  return (
    <header style={{
      background:   "var(--color-bg-panel)",
      borderBottom: "1px solid var(--color-border-dim)",
      position:     "sticky",
      top:           0,
      zIndex:        50,
    }}>
      <div style={{
        display:        "flex",
        alignItems:     "center",
        gap:            "16px",
        padding:        "12px 20px",
        maxWidth:       "100%",
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
          <MoleculeLogoSVG />
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize:   "18px",
            fontWeight: 700,
            color:      "var(--color-cyan)",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}>
            Sci Lab 360
          </span>
        </div>

        {/* Search */}
        <div style={{ flex:1, position:"relative", maxWidth:"480px", margin:"0 auto" }}>
          <Search
            size={16}
            style={{
              position:  "absolute",
              left:      "12px",
              top:       "50%",
              transform: "translateY(-50%)",
              color:     "var(--color-text-muted)",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search elements or molecules..."
            aria-label="Search elements and molecules"
            style={{
              width:        "100%",
              background:   "var(--color-bg-card)",
              border:       "1px solid var(--color-border-dim)",
              borderRadius: "8px",
              padding:      "8px 12px 8px 36px",
              color:        "var(--color-text-primary)",
              fontSize:     "14px",
              outline:      "none",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = "var(--color-cyan)"
              e.currentTarget.style.boxShadow   = "0 0 0 2px var(--color-cyan-dim)"
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = "var(--color-border-dim)"
              e.currentTarget.style.boxShadow   = "none"
            }}
          />
        </div>
      </div>
    </header>
  )
}
