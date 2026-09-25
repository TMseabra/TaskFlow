import {
  UserPlusIcon,
  ListChecksIcon,
  RefreshIcon,
  SearchIcon,
  ChartIcon,
  ShieldIcon,
} from "@/components/site/feature-icons";

const steps = [
  {
    icon: <UserPlusIcon />,
    title: "1. Create your account",
    description:
      "Sign up with name, email and password in under a minute — your password is always encrypted. Want it even faster? Sign in directly with your Google or GitHub account, no forms to fill in. No credit card and no email confirmation needed to start using the app.",
  },
  {
    icon: <ListChecksIcon />,
    title: "2. Create your tasks",
    description:
      "For each task you set a title, an optional description with more detail, a priority (Low, Medium or High) and, if you want, a due date. Everything is stored in your account and only you can see or edit your own tasks — never anyone else's.",
  },
  {
    icon: <RefreshIcon />,
    title: "3. Move tasks between statuses",
    description:
      "Every task goes through three statuses: To Do, In Progress and Done. Just pick the new status from a dropdown next to the task — the change is saved instantly, no page reload needed, and when you mark a task as done the completion date is recorded automatically.",
  },
  {
    icon: <SearchIcon />,
    title: "4. Find anything in seconds",
    description:
      "With dozens of tasks, finding one by eye becomes impossible. That's why you have a search box that looks through the title and description, plus independent filters by status and priority — combine all three at once to get exactly what you need.",
  },
  {
    icon: <ChartIcon />,
    title: "5. Track everything on the dashboard",
    description:
      "As soon as you sign in, the dashboard shows you at a glance: how many tasks you have in total, how many are in each status (To Do / In Progress / Done), and how many are overdue (due date passed and not yet done). It also lists your 5 most recent tasks, so you can pick up where you left off without going to the full list.",
  },
  {
    icon: <ShieldIcon />,
    title: "6. You're always in control of your account",
    description:
      "In Settings you can see your account details and, if you ever want to, delete your account entirely — the action requires explicit confirmation and permanently removes your account and all your tasks. You can also switch between light and dark mode at any time; the preference is saved in your browser.",
  },
];

const features = [
  {
    icon: <UserPlusIcon />,
    title: "Flexible authentication",
    description: "Email+password, Google or GitHub — you choose.",
  },
  {
    icon: <ListChecksIcon />,
    title: "Full CRUD",
    description: "Create, edit and delete tasks without limits.",
  },
  {
    icon: <ChartIcon />,
    title: "Real-time dashboard",
    description: "Statistics updated on every visit.",
  },
  {
    icon: <SearchIcon />,
    title: "Search and filters",
    description: "By text, status and priority, combinable.",
  },
  {
    icon: <RefreshIcon />,
    title: "Simple status flow",
    description: "To Do, In Progress and Done, with one click.",
  },
  {
    icon: <ShieldIcon />,
    title: "Privacy and control",
    description: "Your data is yours alone, and you can delete it whenever you want.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-ink">
          How it works
        </h1>
        <p className="mt-5 text-xl text-body">
          From account to first organized task, step by step.
        </p>
      </div>

      <div className="mt-20 space-y-8">
        {steps.map((step) => (
          <div
            key={step.title}
            className="group flex flex-col gap-5 rounded-2xl border border-line bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-navy/5 sm:flex-row sm:items-start sm:gap-8 dark:border-emerald-900/60 dark:hover:border-emerald-500 dark:hover:shadow-black/40"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 dark:bg-white dark:text-navy [&_svg]:h-8 [&_svg]:w-8">
              {step.icon}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-ink transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {step.title}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-body">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-28">
        <h2 className="text-center text-4xl font-bold text-ink">
          Everything at your disposal
        </h2>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-line p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-navy/5 dark:border-emerald-900/60 dark:hover:border-emerald-500 dark:hover:shadow-black/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-subtle text-ink transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:text-emerald-700 dark:group-hover:bg-emerald-950 dark:group-hover:text-emerald-400 [&_svg]:h-6 [&_svg]:w-6">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-base text-body">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
