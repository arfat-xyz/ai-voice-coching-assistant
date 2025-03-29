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
      {children}
    </DashboardUserContext.Provider>
  );
};

export default DashboardLayoutClientComponent;
