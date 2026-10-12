import { THEMES } from '../../src/shared/store/themeStore'

const applyTheme = (theme: string) => {
  document.documentElement.dataset.theme = theme
}

/**
 * The landing hero. The theme chips write straight to `<html>` so a reader can
 * compare all three without leaving the page — the toolbar control does the
 * same thing for stories.
 */
export const Hero = () => (
  <header className="border-border bg-card flex flex-col gap-6 rounded-xl border p-8">
    <div className="flex flex-col gap-3">
      <span className="typo-overline text-primary">Supply Chain · Admin Panel</span>
      <h1 className="typo-h2 font-heading text-balance">
        The kit this operations panel is built from.
      </h1>
      <p className="typo-body-lg text-muted-foreground max-w-2xl text-pretty">
        Every component below is the real one, rendered from the real tokens, in whichever of the
        three themes you pick. Nothing here is a screenshot.
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span className="typo-label text-muted-foreground mr-1">Theme</span>
      {THEMES.map(theme => (
        <button
          key={theme}
          type="button"
          onClick={() => applyTheme(theme)}
          className="border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring typo-button rounded-md border px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {theme[0].toUpperCase() + theme.slice(1)}
        </button>
      ))}
      <span className="typo-caption text-muted-foreground ml-2">
        light is the default — the panel must be correct before any script runs
      </span>
    </div>
  </header>
)
