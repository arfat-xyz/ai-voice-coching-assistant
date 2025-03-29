import { User as AuthUser } from "next-auth";
import { createContext, useContext } from "react";

export const DashboardUserContext = createContext<AuthUser | undefined>(
  undefined
);
export function useDashboardUser(): AuthUser {
  const user = useContext(DashboardUserContext);
  if (user === undefined) {
    throw new Error("user not found");
  }
  return user;
}
