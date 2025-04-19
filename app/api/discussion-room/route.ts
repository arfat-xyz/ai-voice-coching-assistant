import {
  formatErrorResponse,
  formatResponse,
  routeErrorHandler,
} from "@/lib/api-error-success-response";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/get-auth-user";
import { createDiscussionRoomZod } from "@/lib/zod/discussion-room";

/**
 * Handles a POST request.
 * @param request - The incoming request object.
 * @returns A formatted response or error.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = createDiscussionRoomZod.parse(body);
    const user = await getAuthenticatedUser();
    if (!user?.id) return formatErrorResponse("User not found", 403);
    const createdData = await db.discussionRoom.create({
      data: {
        ...payload,
      },
    });
    console.log({ createdData });
    return formatResponse(createdData, "Data fetched successfully");
  } catch (error) {
    console.log("Error", { error });
    return routeErrorHandler(error);
  }
}
