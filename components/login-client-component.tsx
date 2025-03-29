"use client";
import { signIn } from "next-auth/react";
import React from "react";

const LoginClientComponent = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <button
        type="button"
        className="cursor-pointer py-2 px-4 max-w-md flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        onClick={async () => {
          await signIn("github");
        }}
      >
        Sign in with GitHub
      </button>
    </div>
  );
};

export default LoginClientComponent;
