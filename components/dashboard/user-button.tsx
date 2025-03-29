"use client";
import { useDashboardUser } from "@/hooks/user-context";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoIosLogOut } from "react-icons/io";

/**
 * Component to display the user's profile image or initial letter
 * @param image - The user's profile image URL (if available)
 * @param name - The user's name, used to display the initial if the image is unavailable
 * @returns JSX element for user image or initial
 */
const UserImage = ({ image, name }: { image: string | null; name: string }) => {
  return image ? (
    // If user image is available, render the image
    <Image
      alt={`${name} image`}
      src={image}
      width={48}
      height={48}
      className="w-12 h-12 rounded-full"
    />
  ) : (
    // If no user image, render the user's initial letter
    <div className="w-12 h-12 bg-green-700 text-white capitalize flex justify-center items-center rounded-full text-3xl">
      {name.slice(0, 1)} {/* Display the first letter of the user's name */}
    </div>
  );
};

/**
 * Component to display the user's name and email
 * @param name - The user's name
 * @param email - The user's email address
 * @returns JSX element for displaying the user's details
 */
const UserDetails = ({ name, email }: { name: string; email: string }) => {
  return (
    <div className="grid truncate w-56">
      <span className="font-semibold truncate w-40" title={name}>
        {name}
      </span>{" "}
      {/* Display the user's name */}
      <span className="truncate w-40" title={email}>
        {email}
      </span>{" "}
      {/* Display the user's email */}
    </div>
  );
};

const UserButton = () => {
  const [showlist, setShowlist] = useState(false); // State to toggle visibility of user details
  const handleShowingList = () => setShowlist(!showlist); // Toggle visibility function
  const buttonRef = useRef<HTMLDivElement>(null); // Ref for detecting click outside to close the dropdown
  const user = useDashboardUser(); // Fetch the user data (image, name, email, etc.)

  useEffect(() => {
    // Function to handle clicks outside of the UserButton to close the dropdown list
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowlist(false); // Close the dropdown if the click is outside the button
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={buttonRef}>
      {/* User profile logo */}
      <div className="cursor-pointer" onClick={handleShowingList}>
        <UserImage image={user.image as string} name={user.name as string} />{" "}
        {/* Display user image or initial */}
      </div>

      {/* Dropdown List - Shows user's details and logout option */}
      <div
        className={cn(
          "border p-2 rounded-lg shadow transition-all origin-top-right duration-300 absolute backdrop-blur-2xl",
          showlist
            ? "block opacity-100 visibility-visible scale-100 right-0 md:right-4 top-[52px]" // Show list with smooth transition
            : "opacity-0 visibility-hidden scale-0 right-0 top-6" // Hide list with smooth transition
        )}
      >
        <div>
          <div className="flex items-center-center gap-4">
            <UserImage
              image={user.image as string}
              name={user.name as string}
            />{" "}
            {/* Display user image or initial */}
            <UserDetails
              name={user.name as string}
              email={user.email as string}
            />{" "}
            {/* Display user name and email */}
          </div>
          <hr className="my-2" />{" "}
          {/* Divider between user details and logout */}
          <div className="">
            {/* Logout button */}
            <span
              className="flex gap-2 items-center hover:bg-gray-200 rounded-sm px-2 text-lg duration-300 transition-colors cursor-pointer"
              onClick={() => signOut({ redirectTo: "/login" })}
            >
              <IoIosLogOut /> Logout {/* Logout icon and label */}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserButton;
