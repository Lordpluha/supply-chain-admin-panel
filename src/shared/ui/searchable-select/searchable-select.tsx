import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AutoWidth } from '../auto-width'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../combobox'
import type { SelectOption } from '../option-select'

export interface SearchableSelectProps {
  value: string
  options: ReadonlyArray<SelectOption>
  onChange: (value: string) => void
  /**
   * Supplied when the list is fetched. The component then stops filtering
   * locally and hands the term over instead — the API owns the search.
   */
  onSearch?: (term: string) => void
  isLoading?: boolean
  placeholder?: string
  /** Adds an entry that clears the selection. */
  allLabel?: string
  className?: string
}

/** A select item cannot hold an empty value, so "any" needs a stand-in. */
const ALL = '__all__'

/**
 * A select with a search box, for lists too long to scan.
 *
 * Two modes, and the difference is one prop:
 *
 * - **without `onSearch`** it filters the options it was given, in the browser;
 * - **with `onSearch`** it reports the term and renders whatever comes back,
 *   so a list of thousands never has to be shipped to filter three of them.
 *
 * Pick by where the list lives, not by how long it is. A reference table the
 * screen already holds whole — every country, every product, a static union —
 * filters locally: it is already in the cache, so a request per keystroke buys
 * nothing. A list the API narrows for its own reasons, as the overview's does
 * against the other filter, searches server-side.
 *
 * Either way the trigger is a real text input, so the keyboard reaches it and
 * typing narrows the list — which is the whole reason to prefer this over
 * `OptionSelect` once a list stops fitting on a screen.
 */
export const SearchableSelect = ({
  value,
  options,
  onChange,
  onSearch,
  isLoading = false,
  placeholder,
  allLabel,
  className,
  ...rest
}: SearchableSelectProps & Record<string, unknown>) => {
  const { t } = useTranslation()

  const items = allLabel ? [{ value: ALL, label: allLabel }, ...options] : [...options]
  const selectedItem = items.find(item => item.value === (value || ALL)) ?? null
  // Never the placeholder: that is the input's `placeholder` attribute's job.
  // Written in as the value, it became the local filter's query, and a field
  // placeholdered "Product" offered only products named "Product" — none.
  const selectedLabel = selectedItem?.label ?? ''
  const editing = useRef(false)
  const [inputValue, setInputValue] = useState(selectedLabel)

  // A remotely loaded selected option may not exist on the first render.
  // Adopt its label once it arrives, unless the operator is currently typing.
  useEffect(() => {
    if (!editing.current) setInputValue(selectedLabel)
  }, [selectedLabel])

  /**
   * Only what the operator typed is a search.
   *
   * `onInputValueChange` also fires when the combobox writes the *selected*
   * item's label into the field — on mount, on a pick, on arrow-key
   * navigation. Forwarding those made the label the next query: picking
   * "Germany" searched for "Germany" so the list could return nothing else,
   * and clearing the selection searched for the literal "Any country" and
   * returned nothing at all. The reason is the only thing that tells the two
   * apart.
   */
  const handleInputValue = (next: string, details: { reason: string }) => {
    if (details.reason !== 'input-change' && details.reason !== 'input-clear') return
    editing.current = true
    setInputValue(next)
    onSearch?.(next)
  }

  const allLabels = [
    ...(allLabel ? [allLabel] : []),
    ...(placeholder ? [placeholder] : []),
    ...options.map(option => option.label),
  ]

  return (
    <AutoWidth labels={allLabels} className={className}>
      <Combobox
        items={items}
        // The whole option object is the value, not its id. Given a bare
        // string the combobox has nothing to resolve a label from and renders
        // the id — `de` where `Germany` belongs.
        value={selectedItem}
        onValueChange={next => {
          const picked = next as SelectOption | null
          editing.current = false
          setInputValue(picked?.label ?? '')
          onChange(!picked || picked.value === ALL ? '' : picked.value)
          // A selection ends the search it came from. Without this, reopening
          // the list shows only the handful the last term matched — so after
          // choosing Germany the only country on offer is Germany.
          onSearch?.('')
        }}
        // With a remote search the component must not second-guess the server:
        // it already returned the matches.
        filter={onSearch ? null : undefined}
        inputValue={inputValue}
        onInputValueChange={handleInputValue}
        onOpenChange={open => {
          if (open) return
          editing.current = false
          setInputValue(selectedLabel)
          onSearch?.('')
        }}
        itemToStringLabel={item => (item as SelectOption | null)?.label ?? ''}
      >
        <ComboboxInput
          placeholder={placeholder ?? t('common.search')}
          triggerLabel={t('common.showOptions')}
          className="w-full"
          {...rest}
        />

        <ComboboxContent>
          {isLoading ? (
            <div className="text-muted-foreground flex items-center gap-2 px-3 py-4">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span className="typo-caption">{t('common.loading')}</span>
            </div>
          ) : (
            <>
              <ComboboxEmpty>{t('common.noResults')}</ComboboxEmpty>
              <ComboboxList>
                {(item: SelectOption) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </>
          )}
        </ComboboxContent>
      </Combobox>
    </AutoWidth>
  )
}
