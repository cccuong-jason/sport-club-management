import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AttendanceReportPanel({ entries }: { entries: any[] }) {
  return (
    <Card
      id="attendance-report"
      className="overflow-hidden rounded-none border-zinc-200 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85"
    >
      <CardHeader className="border-b border-zinc-200/70 bg-gradient-to-r from-primary/12 via-transparent to-transparent dark:border-zinc-800/70 dark:from-primary/15">
        <CardTitle className="font-heading text-2xl uppercase tracking-[0.08em]">Attendance Report</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_140px] border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <span>Member</span>
            <span>Sessions</span>
            <span className="text-right">Attendance</span>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {entries.map((e: any, idx: number) => (
              <div
                key={e.userId}
                className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_140px] items-center gap-4 px-4 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
              >
                <div className="min-w-0">
                  <div className="font-medium text-zinc-950 dark:text-white">
                    #{idx + 1} {e.name}
                  </div>
                  <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">{e.email}</div>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  {e.present}/{e.total} sessions
                </div>
                <div className="flex items-center justify-end gap-3">
                  <div className="h-2 w-20 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-full bg-primary" style={{ width: `${e.percent}%` }} />
                  </div>
                  <div className="w-12 text-right font-black text-zinc-950 dark:text-white">{e.percent}%</div>
                </div>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="px-4 py-10 text-center text-zinc-500 dark:text-zinc-400">No members found.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
