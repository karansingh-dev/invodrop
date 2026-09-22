import { FileText } from "lucide-react"

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden border-r bg-sidebar p-10 lg:flex lg:flex-col">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FileText className="size-4" />
        </div>
        <span className="text-sm font-medium tracking-tight">Invodrop</span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-10 py-12">
        <div className="max-w-md">
          <p className="text-3xl font-medium tracking-tight text-balance">
            Invoices without the clutter.
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Create, send, and track invoices from one calm workspace.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-xl bg-card p-5 shadow-sm ring-1 ring-foreground/10">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">INV-2048</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              Due
            </span>
          </div>
          <div className="space-y-3">
            <div className="h-2 w-3/4 rounded-full bg-muted" />
            <div className="h-2 w-1/2 rounded-full bg-muted" />
            <div className="h-2 w-5/6 rounded-full bg-muted" />
          </div>
          <div className="mt-6 flex items-end justify-between border-t pt-4">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-sm font-medium">$2,480.00</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default BrandPanel
