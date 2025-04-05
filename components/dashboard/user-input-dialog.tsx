"use client";
import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CoachingExpert, CoachingOptionProps } from "@/constants/options";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const UserInputDialog = ({
  children,
  coachingOption,
}: {
  children: ReactNode;
  coachingOption: CoachingOptionProps;
}) => {
  const [selectedExpert, setSelectedExpert] = useState<string>("");
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coachingOption.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3">
              <h2 className="text-black">
                Enter a topic to master your skills in {coachingOption.name}{" "}
              </h2>
              <Textarea placeholder="Enter your topic" className="mt-2" />

              <h2 className="text-black mt-5">
                Enter a topic to master your skills in {coachingOption.name}{" "}
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                {CoachingExpert.map((expert, i) => (
                  <div key={i} onClick={() => setSelectedExpert(expert.name)}>
                    <Image
                      src={expert.avatar}
                      alt={expert.name}
                      width={100}
                      height={100}
                      className={cn(
                        "rounded-2xl size-20 object-fill hover:scale-105 transition-all duration-300 p-1 border-primary",
                        selectedExpert === expert.name && "border"
                      )}
                    />
                    <h2 className="text-center">{expert.name}</h2>
                  </div>
                ))}
              </div>
              <div className="flex gap-5 justify-end mt-5">
                <Button variant={"ghost"}>Cancel</Button>
                <Button>Next</Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserInputDialog;
