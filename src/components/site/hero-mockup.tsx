const sideItems = [
  { label: "Dashboard", icon: "▣", active: true },
  { label: "Tasks", icon: "□", active: false },
  { label: "Calendar", icon: "▣", active: false },
  { label: "Projects", icon: "⚑", active: false },
  { label: "Team", icon: "♧", active: false },
  { label: "Reports", icon: "▥", active: false },
  { label: "Settings", icon: "⚙", active: false },
];

const stats = [
  { label: "Total tasks", value: "128", delta: "+12% from last week" },
  { label: "In progress", value: "64", delta: "+8% from last week" },
  { label: "Completed", value: "48", delta: "+16% from last week" },
  { label: "Overdue", value: "16", delta: "+4% from last week" },
];

const deadlines = [
  { label: "Design new landing page", priority: "High" },
  { label: "API integration", priority: "Medium" },
  { label: "Project report", priority: "Low" },
];

const deadlineStyle: Record<string, string> = {
  High: "text-[#e49a9a] bg-[#fff0f0]",
  Medium: "text-[#d6ad68] bg-[#fff8e8]",
  Low: "text-[#72c58f] bg-[#effbf4]",
};

const recentTasks = [
  { label: "Review new designs", when: "Today" },
  { label: "Fix login bug", when: "Today" },
  { label: "Content update", when: "Tomorrow" },
];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HeroMockup() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-[8%] flex h-[700px] w-[min(88vw,1400px)] -translate-x-1/2 rotate-[-3deg] overflow-hidden rounded-3xl border border-[#e6e9ec] bg-[#fbfcfc] shadow-[0_20px_60px_rgba(20,40,50,0.06)] dark:border-[#27313c] dark:bg-[#121a23]"
      >
        <aside className="w-[220px] shrink-0 border-r border-[#edf0f2] bg-[#fcfdfd] p-8 dark:border-[#27313c] dark:bg-[#0f151d]">
          <div className="mb-10 text-xl font-extrabold text-[#0b6264] dark:text-[#3ddc9a]">
            task<span className="text-[#00c96b]">flow</span>
          </div>
          <nav className="space-y-1.5">
            {sideItems.map((item) => (
              <div
                key={item.label}
                className={`rounded-md px-3 py-2.5 text-sm ${
                  item.active
                    ? "bg-[#effbf5] text-[#55c98b] dark:bg-[#0f2a20] dark:text-[#4fd394]"
                    : "text-[#89929d] dark:text-[#5a6572]"
                }`}
              >
                {item.icon}&nbsp;&nbsp;{item.label}
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex-1 p-9">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-[#7a838e] dark:text-[#7a8794]">Dashboard</h3>
            <div className="rounded-md bg-[#baf0d0] px-4 py-2.5 text-sm text-[#4fb879] dark:bg-[#0f2a20] dark:text-[#4fd394]">
              + New task
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[10px] border border-[#eef0f2] bg-white p-5 dark:border-[#27313c] dark:bg-[#121a23]"
              >
                <div className="text-sm text-[#9ba3ac] dark:text-[#5a6572]">{stat.label}</div>
                <div className="mt-3 text-2xl text-[#6e7782] dark:text-[#c9d0d8]">{stat.value}</div>
                <div className="mt-1.5 text-xs text-[#6dce95] dark:text-[#4fd394]">{stat.delta}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-[1fr_300px] gap-4">
            <div className="h-[260px] rounded-[10px] border border-[#eef0f2] bg-white p-5 dark:border-[#27313c] dark:bg-[#121a23]">
              <h4 className="mb-5 text-sm text-[#89919b] dark:text-[#7a8794]">Task overview</h4>
              <div
                className="relative h-[170px] border-b border-[#e8ebed] dark:border-[#27313c]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent 41px, #f0f2f3 42px)",
                }}
              >
                <div className="absolute left-[7%] right-[5%] top-20 h-[70px] -skew-y-[12deg] border-t-[3px] border-[#9fe8bc]" />
                <div className="absolute -bottom-6 flex w-full justify-between text-[10px] text-[#adb4bc] dark:text-[#5a6572]">
                  {dayLabels.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-[260px] rounded-[10px] border border-[#eef0f2] bg-white p-5 dark:border-[#27313c] dark:bg-[#121a23]">
              <h4 className="mb-5 text-sm text-[#89919b] dark:text-[#7a8794]">Upcoming deadlines</h4>
              {deadlines.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between border-b border-[#f0f1f2] py-3.5 text-xs text-[#9299a1] last:border-0 dark:border-[#27313c] dark:text-[#7a8794]"
                >
                  {d.label}
                  <em className={`rounded-full px-2 py-1 text-[10px] not-italic ${deadlineStyle[d.priority]}`}>
                    {d.priority}
                  </em>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[10px] border border-[#eef0f2] bg-white p-5 dark:border-[#27313c] dark:bg-[#121a23]">
            <h4 className="mb-5 text-sm text-[#89919b] dark:text-[#7a8794]">Recent tasks</h4>
            {recentTasks.map((t) => (
              <div
                key={t.label}
                className="flex items-center justify-between border-t border-[#f0f1f2] py-2.5 text-xs text-[#969da5] first:border-0 dark:border-[#27313c] dark:text-[#7a8794]"
              >
                <span>
                  <span className="mr-2 text-[#8ed7a9]">○</span>
                  {t.label}
                </span>
                <span>{t.when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,255,255,.55), rgba(255,255,255,.88) 45%, rgba(255,255,255,.97) 76%), linear-gradient(90deg, rgba(255,255,255,.9), rgba(237,250,243,.45), rgba(255,255,255,.9))",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(0,0,0,.25), rgba(0,0,0,.83) 50%, rgba(0,0,0,.96) 78%), linear-gradient(90deg, rgba(0,0,0,.88), rgba(0,201,107,.08), rgba(0,0,0,.88))",
        }}
      />
    </div>
  );
}
