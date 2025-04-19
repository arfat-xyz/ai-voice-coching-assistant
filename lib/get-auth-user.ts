import { auth } from "@/auth";
import { Session } from "next-auth";

/**
 * Gets the authenticated user or throws an error
 * @throws {Error} If user is not authenticated
 * @returns {Promise<Session['user']>} The authenticated user
 */
export async function getAuthenticatedUser(): Promise<Session["user"]> {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  return session.user;
}
