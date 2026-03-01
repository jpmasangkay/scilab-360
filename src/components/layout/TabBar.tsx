export type TabId =
  | "bonding"
  | "periodic"
  | "library"
  | "quiz"
  | "freeplay"
  | "dashboard"

const TABS: { id: TabId; label: string }[] = [
  { id: "bonding",   label: "Bonding" },
  { id: "periodic",  label: "Periodic Table" },
  { id: "library",   label: "Library" },
  { id: "quiz",      label: "Quiz Mode" },
  { id: "freeplay",  label: "Free Play" },
  { id: "dashboard", label: "Dashboard" },
]

interface TabBarProps {
  active:   TabId
  onChange: (tab: TabId) => void
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label="Application tabs"
      style={{
        background:     "var(--color-bg-panel)",
        borderBottom:   "1px solid var(--color-border-dim)",
        display:        "flex",
        overflowX:      "auto",
        scrollbarWidth: "none",
        padding:        "0 20px",
        flexShrink:     0,
      }}
    >
      {TABS.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`${tab.label} tab`}
            onClick={() => onChange(tab.id)}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "6px",
              padding:      "12px 18px",
              border:       "none",
              borderBottom: isActive
                ? "2px solid var(--color-cyan)"
                : "2px solid transparent",
              background:   "transparent",
              color:        isActive ? "var(--color-cyan)" : "var(--color-text-muted)",
              cursor:       "pointer",
              fontSize:     "16px",
              fontWeight:   isActive ? 600 : 400,
              whiteSpace:   "nowrap",
              transition:   "color 0.2s, border-color 0.2s",
              boxShadow:    isActive ? "0 2px 12px var(--color-cyan-glow)" : "none",
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
