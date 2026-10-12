import { Alert, AlertDescription, AlertTitle } from '../../src/shared/ui/alert'
import { Badge } from '../../src/shared/ui/badge'
import { Button } from '../../src/shared/ui/button'
import { Input } from '../../src/shared/ui/input'
import { Label } from '../../src/shared/ui/label'
import { Skeleton } from '../../src/shared/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src/shared/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/shared/ui/tabs'
import { Typography } from '../../src/shared/ui/typography'
import { Canvas, CanvasCard } from './Canvas'

const ROWS = [
  { country: 'China', product: 'Lithium Carbonate', output: '92 000 t' },
  { country: 'Chile', product: 'Lithium Carbonate', output: '86 000 t' },
  { country: 'Australia', product: 'Nickel Sulfate', output: '41 000 t' },
]

export const ComponentCanvas = () => (
  <Canvas>
    <CanvasCard title="Button" note="Five variants, three sizes">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </CanvasCard>

    <CanvasCard title="Badge" note="Status in a table row">
      <Badge>Active</Badge>
      <Badge variant="secondary">Planned</Badge>
      <Badge variant="outline">Idle</Badge>
      <Badge variant="destructive">Suspended</Badge>
    </CanvasCard>

    <CanvasCard title="Input" note="Always with a real label">
      <div className="flex w-full flex-col gap-1.5">
        <Label htmlFor="overview-sku">SKU</Label>
        <Input id="overview-sku" defaultValue="NMC-811" />
      </div>
    </CanvasCard>

    <CanvasCard title="Tabs" note="Pick a country first, or a product first">
      <Tabs defaultValue="country" className="w-full">
        <TabsList>
          <TabsTrigger value="country">Country</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
        </TabsList>
        <TabsContent value="country" className="typo-body-sm text-muted-foreground pt-3">
          The product list narrows to what this country makes.
        </TabsContent>
        <TabsContent value="product" className="typo-body-sm text-muted-foreground pt-3">
          The country list narrows to who makes this product.
        </TabsContent>
      </Tabs>
    </CanvasCard>

    <CanvasCard title="Table" note="Sorted, searched, filtered and paginated in the URL">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Output</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map(row => (
            <TableRow key={`${row.country}-${row.product}`}>
              <TableCell>{row.country}</TableCell>
              <TableCell className="text-muted-foreground">{row.product}</TableCell>
              <TableCell className="text-right tabular-nums">{row.output}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CanvasCard>

    <CanvasCard title="Alert" note="A refusal explains which permission is missing">
      <Alert>
        <AlertTitle>No access</AlertTitle>
        <AlertDescription>
          Your role does not include <code className="typo-code">production:write</code>.
        </AlertDescription>
      </Alert>
    </CanvasCard>

    <CanvasCard title="Skeleton" note="Held at the final height — no layout shift">
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CanvasCard>

    <CanvasCard title="Typography" note="Semantic tokens, never a raw size">
      <div className="flex flex-col gap-1">
        <Typography level={4}>Production by country</Typography>
        <Typography size="bodySm" tone="muted">
          2010–2026 · 24 countries · 44 facilities
        </Typography>
      </div>
    </CanvasCard>
  </Canvas>
)
