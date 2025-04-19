import { auth } from "@/auth";
import DashboardLayoutClientComponent from "@/components/dashboard/dashboard-layout-client-component";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session?.user) return redirect("/login");
  return (
    <DashboardLayoutClientComponent user={session?.user}>
      {children}
    </DashboardLayoutClientComponent>
  );
};

export default DashboardLayout;
