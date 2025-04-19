import SingleDiscussionRoomClientComponent from "@/components/dashboard/discussion-room/single-discussion-room-client-component";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";

const SingleDiscussionRoom = async ({
  params,
}: {
  params: Promise<{ roomid: string }>;
}) => {
  const { roomid } = await params;

  const discussionRoom = await db.discussionRoom.findUnique({
    where: {
      id: roomid,
    },
  });
  if (!discussionRoom?.id) {
    notFound();
  }
  return (
    <SingleDiscussionRoomClientComponent discussionRoom={discussionRoom} />
  );
};

export default SingleDiscussionRoom;
