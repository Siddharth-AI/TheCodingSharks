import home from "@/data/home.json"

export function HeroCredibility() {
  const groups = home.hero.credibility

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {groups.map((group) => (
        <div key={group.label} className="space-y-3">
          <p className="text-xs text-muted-foreground">{group.label}</p>
          <div className="flex flex-wrap gap-2 rounded-2xl bg-foreground/[0.06] p-3">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-xl bg-[#fefaf5] px-3 py-2 text-xs font-semibold text-[#13232f]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}