import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'
import type { UseSupplyFiltersResult } from '../model/useSupplyFilters'
import { SupplyFilters } from './SupplyFilters'

export interface SupplyFiltersDrawerProps {
  filters: UseSupplyFiltersResult
  /** Countries left after the current filters, shown on the apply button. */
  resultCount: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * The filter bar as a bottom sheet, for screens with no room for a toolbar.
 *
 * The filters still apply as they are changed rather than on "apply" — they
 * live in the URL, and a sheet that batched them would have to hold a second,
 * divergent copy of the same state. The button is an acknowledgement and a
 * count, which is what makes it worth pressing; the map behind the sheet has
 * already moved by the time it is.
 */
export const SupplyFiltersDrawer = ({
  filters,
  resultCount,
  open,
  onOpenChange,
}: SupplyFiltersDrawerProps) => {
  const { t } = useTranslation()

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t('dashboard.filters')}</DrawerTitle>
          <DrawerDescription>{t('dashboard.modeHint')}</DrawerDescription>
        </DrawerHeader>

        <SupplyFilters filters={filters} />

        <DrawerFooter>
          <Button
            variant="ghost"
            onClick={filters.reset}
            disabled={!filters.isFiltered}
            className="shrink-0"
          >
            {t('common.reset')}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="shrink-0">
            {t('common.close')}
          </Button>
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            {t('dashboard.showResults', { count: resultCount })}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
