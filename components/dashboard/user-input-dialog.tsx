"use client";
import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CoachingExpert } from "@/constants/options";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateDiscussionRoomFormValues,
  createDiscussionRoomZod,
} from "@/lib/zod/discussion-room";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-toast-response";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { CoachingOptionProps } from "@/lib/interface/utils";

const UserInputDialog = ({
  children,
  coachingOption,
}: {
  children: ReactNode;
  coachingOption: CoachingOptionProps;
}) => {
  const router = useRouter();
  const [openModal, setOpenModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateDiscussionRoomFormValues>({
    resolver: zodResolver(createDiscussionRoomZod),
    defaultValues: {
      coachingOption: coachingOption.name,
      expertName: "",
      topic: "",
    },
  });

  const selectedExpert = watch("expertName");

  const onSubmit = async (formData: CreateDiscussionRoomFormValues) => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`/api/discussion-room`, formData);
      if (!data?.success) {
        reset();
        frontendErrorResponse({ message: data?.message });
      }
      frontendSuccessResponse({ message: data?.message });
      router.push(`/dashboard/discussion-room/${data?.data?.id}`);
      return;
      // Handle successful submission
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      setOpenModal(false);
    }
  };

  return (
    <Dialog
      open={openModal}
      onOpenChange={(open) => {
        if (!isSubmitting) {
          setOpenModal(open);
        }
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coachingOption.name}</DialogTitle>
          <DialogDescription asChild>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
              <input type="hidden" {...register("coachingOption")} />

              <h2 className="text-black">
                Enter a topic to master your skills in {coachingOption.name}
              </h2>
              <Textarea
                placeholder="Enter your topic"
                className="mt-2"
                {...register("topic")}
                disabled={isSubmitting}
              />
              {errors.topic && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.topic.message}
                </p>
              )}

              <h2 className="text-black mt-5">
                Select an expert for {coachingOption.name}
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                {CoachingExpert.map((expert, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      !isSubmitting && setValue("expertName", expert.name)
                    }
                    className={cn(
                      "cursor-pointer",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Image
                      src={expert.avatar}
                      alt={expert.name}
                      width={100}
                      height={100}
                      className={cn(
                        "rounded-2xl size-20 object-fill hover:scale-105 transition-all duration-300 p-1 border-primary",
                        selectedExpert === expert.name && "border",
                        isSubmitting && "hover:scale-100"
                      )}
                    />
                    <h2 className="text-center">{expert.name}</h2>
                  </div>
                ))}
              </div>
              {errors.expertName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expertName.message}
                </p>
              )}

              <div className="flex gap-5 justify-end mt-5">
                <Button
                  variant={"ghost"}
                  type="button"
                  onClick={() => setOpenModal(false)}
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2.5">
                      <Loader className="animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserInputDialog;
