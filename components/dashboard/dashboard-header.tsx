import Image from "next/image";
import React from "react";
import UserButton from "./user-button";

const DashboardHeaderComponent = () => {
  return (
    <div className="p-3 shadow-sm flex justify-between items-center">
      <Image src={`/logo.svg`} height={140} width={200} alt="Ai" />
      <UserButton />
    </div>
  );
};

export default DashboardHeaderComponent;
