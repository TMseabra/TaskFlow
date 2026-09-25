import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { CheckIcon, CrownIcon } from "@/components/ui/icons";
import { DangerZone } from "@/components/settings/danger-zone";
import { ProfileForm } from "@/components/settings/profile-form";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const included = ["Unlimited tasks and projects", "Dashboard, calendar and reports", "Dark mode and team view"];

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <Card>
        <CardHeader title="Profile" />
        <ProfileForm initialName={user.name ?? ""} initialEmail={user.email!} />
      </Card>

      <Card>
        <CardHeader title="Appearance" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink">Theme</p>
            <p className="text-sm text-muted">Switch between light and dark mode. Saved on this device.</p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      <section id="plan" className="scroll-mt-24">
        <Card>
          <CardHeader title="Plan" />
          <div className="flex flex-col gap-5 @xl/main:flex-row @xl/main:items-center @xl/main:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                <CrownIcon width={18} height={18} />
              </span>
              <div>
                <p className="font-semibold text-ink">Free plan</p>
                <p className="mt-0.5 text-sm text-muted">
                  Every feature is currently included for free. Pro plans are coming soon.
                </p>
              </div>
            </div>
            <ul className="space-y-1.5">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-body">
                  <CheckIcon width={15} height={15} className="text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      <DangerZone email={user.email!} />
    </div>
  );
}
