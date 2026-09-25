import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData(session!.user.id);

  return <DashboardView data={data} />;
}
