"use client";
import { useDashboardUser } from "@/hooks/user-context";
import React from "react";
import { Button } from "../ui/button";
import { coachingOptions } from "@/constants/options";
import Image from "next/image";

const FeatureAssistantsComponent = () => {
  const user = useDashboardUser();
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="">
          <h2 className="font-medium text-muted-foreground">My Workspace</h2>
          <h2 className="text-3xl font-bold ">Welcome back, {user.name}</h2>
        </div>
        <Button>Profile</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mt-10">
        {coachingOptions.map((option, i) => (
          <div
            key={i}
            className="p-3 bg-secondary rounded-3xl flex flex-col justify-center items-center group"
          >
            <Image
              src={option.icon}
              alt={option.name}
              width={150}
              height={150}
              className="h-[70px] w-[70px] group-hover:rotate-12 transition-all duration-150"
            />
            <h2 className="mt-2">{option.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureAssistantsComponent;
