const SURFACE_TOKENS = ['background', 'card', 'popover', 'muted', 'accent', 'secondary'] as const

const ACCENT_TOKENS = ['primary', 'destructive', 'success', 'warning'] as const

const MAP_TOKENS = ['map-ocean', 'map-land', 'map-land-stroke', 'map-graticule'] as const

const CHART_TOKENS = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] as const

const Swatch = ({ token }: { token: string }) => (
  <div className="flex flex-col gap-1.5">
    <div
      className="border-border h-14 w-full rounded-md border"
      style={{ backgroundColor: `var(--${token})` }}
    />
    <code className="typo-code text-muted-foreground">--{token}</code>
  </div>
)

export const ColourTokens = () => (
  <div className="flex flex-col gap-6">
    {[
      { label: 'Surfaces', tokens: SURFACE_TOKENS },
      { label: 'Accents', tokens: ACCENT_TOKENS },
      { label: 'Charts', tokens: CHART_TOKENS },
      { label: 'Map', tokens: MAP_TOKENS },
    ].map(group => (
      <div key={group.label} className="flex flex-col gap-2">
        <span className="typo-label text-muted-foreground">{group.label}</span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {group.tokens.map(token => (
            <Swatch key={token} token={token} />
          ))}
        </div>
      </div>
    ))}
  </div>
)

const TYPE_SCALE = [
  { utility: 'typo-display', sample: 'Display' },
  { utility: 'typo-h1', sample: 'Heading 1' },
  { utility: 'typo-h2', sample: 'Heading 2' },
  { utility: 'typo-h3', sample: 'Heading 3' },
  { utility: 'typo-h4', sample: 'Heading 4' },
  { utility: 'typo-h5', sample: 'Heading 5' },
  { utility: 'typo-h6', sample: 'Heading 6' },
  { utility: 'typo-body-lg', sample: 'Body large' },
  { utility: 'typo-body', sample: 'Body' },
  { utility: 'typo-body-sm', sample: 'Body small' },
  { utility: 'typo-label', sample: 'Label' },
  { utility: 'typo-caption', sample: 'Caption' },
  { utility: 'typo-overline', sample: 'Overline' },
  { utility: 'typo-button', sample: 'Button' },
  { utility: 'typo-code', sample: 'Code' },
] as const

/**
 * Every row resolves to a `--typography-*` token, stated in `rem`. Change the
 * browser's font size and the whole scale moves with it — which is the point.
 */
export const TypeScale = () => (
  <div className="border-border divide-border divide-y rounded-lg border">
    {TYPE_SCALE.map(row => (
      <div key={row.utility} className="flex items-baseline justify-between gap-6 px-5 py-3">
        <span className={row.utility}>{row.sample}</span>
        <code className="typo-code text-muted-foreground shrink-0">.{row.utility}</code>
      </div>
    ))}
  </div>
)
