import { useTranslation } from 'react-i18next'
import type { Currency } from '@/shared/config/currency'
import { CURRENCIES, CURRENCY_SYMBOLS } from '@/shared/config/currency'
import { changeLanguage, LANGUAGES, useLanguage } from '@/shared/i18n'
import { formatTimeZoneLabel } from '@/shared/lib/format'
import {
  resolveBrowserTimeZone,
  useEffectiveTimeZone,
  usePreferencesStore,
} from '@/shared/store/preferencesStore'
import type { Theme } from '@/shared/store/themeStore'
import { THEMES, useThemeStore } from '@/shared/store/themeStore'
import { Label } from '@/shared/ui/label'
import { OptionSelect } from '@/shared/ui/option-select'
import { Separator } from '@/shared/ui/separator'
import { TIME_ZONE_GROUPS } from '../config/timeZones'

/** Sentinel for "follow the browser" — a select item cannot hold an empty value. */
const AUTO_ZONE = '__auto__'

export const SettingsPanel = () => {
  const { t, i18n } = useTranslation()
  const locale = useLanguage()

  const theme = useThemeStore(state => state.theme)
  const setTheme = useThemeStore(state => state.setTheme)

  const storedZone = usePreferencesStore(state => state.timeZone)
  const setTimeZone = usePreferencesStore(state => state.setTimeZone)
  const currency = usePreferencesStore(state => state.currency)
  const setCurrency = usePreferencesStore(state => state.setCurrency)
  const effectiveZone = useEffectiveTimeZone()

  const zoneOptions = [
    { value: AUTO_ZONE, label: t('settings.timeZoneAuto', { zone: resolveBrowserTimeZone() }) },
    ...TIME_ZONE_GROUPS.flatMap(group =>
      group.zones.map(zone => ({
        value: zone,
        label: zone.split('/').slice(1).join(' / ').replace(/_/g, ' ') || zone,
        group: group.region,
      })),
    ),
  ]

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4" aria-labelledby="settings-appearance">
        <h3 id="settings-appearance" className="typo-overline text-muted-foreground">
          {t('settings.appearance')}
        </h3>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="settings-theme">{t('theme.label')}</Label>
          <OptionSelect
            id="settings-theme"
            value={theme}
            onChange={value => setTheme(value as Theme)}
            options={THEMES.map(option => ({ value: option, label: t(`theme.${option}`) }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="settings-language">{t('language.label')}</Label>
          <OptionSelect
            id="settings-language"
            value={locale}
            // `changeLanguage` fetches the dictionary first: switching before it
            // lands would render every key in English for a frame.
            onChange={value => {
              if (value) void changeLanguage(i18n, value)
            }}
            // The code leads, uppercase, so the list scans as a set of tags
            // rather than a paragraph of language names.
            options={LANGUAGES.map(option => ({
              value: option,
              label: `${option.toUpperCase()} · ${t(`language.${option}`)}`,
            }))}
          />
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-4" aria-labelledby="settings-regional">
        <h3 id="settings-regional" className="typo-overline text-muted-foreground">
          {t('settings.regional')}
        </h3>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="settings-timezone">{t('settings.timeZone')}</Label>
          <OptionSelect
            id="settings-timezone"
            value={storedZone ?? AUTO_ZONE}
            onChange={value => setTimeZone(value === AUTO_ZONE || !value ? null : value)}
            options={zoneOptions}
          />
          <p className="typo-caption text-muted-foreground">
            {t('settings.timeZoneHint')} — {formatTimeZoneLabel(effectiveZone, locale)}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="settings-currency">{t('settings.currency')}</Label>
          <OptionSelect
            id="settings-currency"
            value={currency}
            onChange={value => setCurrency(value as Currency)}
            options={CURRENCIES.map(option => ({
              value: option,
              label: `${CURRENCY_SYMBOLS[option]} · ${option}`,
            }))}
          />
          <p className="typo-caption text-muted-foreground">{t('settings.currencyHint')}</p>
        </div>
      </section>
    </div>
  )
}
