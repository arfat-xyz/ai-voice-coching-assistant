"use client";
import { CoachingExpert } from "@/constants/options";
import { frontendErrorResponse } from "@/lib/frontend-toast-response";
import { CoachingExpertProps } from "@/lib/interface/utils";
import { DiscussionRoom } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import UserButton from "../user-button";
import { Button } from "@/components/ui/button";
import RecordRTC from "recordrtc";

const SingleDiscussionRoomClientComponent = ({
  discussionRoom,
}: {
  discussionRoom: DiscussionRoom;
}) => {
  const recorder = useRef<RecordRTC | null>(null); // Explicitly type as RecordRTC or null
  const streamRef = useRef<MediaStream | null>(null);
  const [expert, setExpert] = useState<CoachingExpertProps>();
  const [enableMic, setEnableMic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Fix the type for the timeout ref

  useEffect(() => {
    const getExpert = CoachingExpert.find(
      (item) => item.name === discussionRoom.expertName
    );
    if (!getExpert?.name) {
      frontendErrorResponse({ message: "Expert not found" });
      notFound();
      return;
    }
    setExpert(getExpert);

    return () => {
      stopRecording();
    };
  }, [discussionRoom.expertName]);

  const connectToServer = async () => {
    try {
      setIsLoading(true);
      if (typeof window === "undefined" || typeof navigator === "undefined") {
        throw new Error("Browser APIs not available");
      }

      const RecordRTC = (await import("recordrtc")).default;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      recorder.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm;codecs=pcm",
        recorderType: RecordRTC.StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        ondataavailable: async (blob) => {
          clearTimeout(silenceTimeoutRef.current!);
          const buffer = await blob.arrayBuffer();
          console.log("Audio chunk:", buffer);

          silenceTimeoutRef.current = setTimeout(() => {
            console.log("Silence detected");
            stopRecording();
          }, 2000);
        },
      });

      recorder.current.startRecording();
      setEnableMic(true);
    } catch (err) {
      console.error("Recording error:", err);
      frontendErrorResponse({
        message:
          err instanceof Error ? err.message : "Failed to start recording",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = () => {
    try {
      if (recorder.current) {
        recorder.current.stopRecording(() => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          recorder.current = null;
        });
      }
      clearTimeout(silenceTimeoutRef.current!);
      setEnableMic(false);
    } catch (err) {
      console.error("Error stopping recording:", err);
    }
  };

  const disconnectServer = (e: React.MouseEvent) => {
    e.preventDefault();
    stopRecording();
  };

  if (!expert?.avatar) return null;

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">{discussionRoom?.coachingOption}</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            <Image
              src={expert.avatar}
              alt="Avatar"
              width={200}
              height={200}
              className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
              priority
            />
            <h2 className="text-gray-500">{expert.name}</h2>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex justify-center items-center">
            {enableMic ? (
              <Button
                onClick={disconnectServer}
                variant="destructive"
                disabled={isLoading}
              >
                {isLoading ? "Disconnecting..." : "Disconnect"}
              </Button>
            ) : (
              <Button onClick={connectToServer} disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect"}
              </Button>
            )}
          </div>
        </div>
        <div className="">
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            <h2 className="">Chat Section</h2>
          </div>
          <h2 className="mt-4 text-gray-400 text-sm">
            At the end of your conversation we will automatically generate
            feedback/notes from your conversation
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SingleDiscussionRoomClientComponent;
