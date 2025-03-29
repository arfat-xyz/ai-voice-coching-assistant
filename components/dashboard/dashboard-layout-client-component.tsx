"use client";
import React, { ReactNode } from "react";
import DashboardHeaderComponent from "./dashboard-header";
import { User as AuthUser } from "next-auth";
import { DashboardUserContext } from "@/hooks/user-context";

const DashboardLayoutClientComponent = ({
  children,
  user,
}: {
  children: ReactNode;
  user: AuthUser;
}) => {
  return (
    <DashboardUserContext.Provider value={user}>
      <DashboardHeaderComponent />
      <div className="p-10 mt-20 lg:px-32 xl:px-56 2xl:px-72">{children}</div>
    </DashboardUserContext.Provider>
  );
};

export default DashboardLayoutClientComponent;
