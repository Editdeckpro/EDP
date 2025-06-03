"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, fileToBase64 } from "@/lib/utils";
import { ProfileFormType, profileSchema } from "@/schemas/edit-profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { editFormDataSubmit } from "./request";

export default function EditProfileForm() {
  const { data, update } = useSession();
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      image: undefined,
    },
  });

  async function onSubmit(values: ProfileFormType) {
    setIsSubmitting(true);
    try {
      await editFormDataSubmit(values);
      await update();
      toast.success("Profile updated successfully!");
    } catch (e) {
      const error = e as { message: string } | undefined;
      console.log(error, "Error in edit profile form submission");
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">Upload Profile Image</FormLabel>
              <FormControl>
                <div className="flex items-center gap-5 flex-col 2xs:flex-row">
                  <Image
                    src={
                      imageBase64 ||
                      data?.user.profileImage ||
                      "/images/pfp.jpg"
                    }
                    width={75}
                    height={75}
                    alt="User Profile Pic"
                    className="rounded-xl aspect-square"
                  />
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/jpeg, image/webp, image/png"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file); // pass File to RHF
                        setImageBase64(await fileToBase64(file));
                      }
                    }}
                  />
                  <Label
                    className={cn(buttonVariants({ variant: "default" }))}
                    htmlFor="profile-image"
                  >
                    Upload Image <Upload />
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="Email"
                    placeholder="Enter Your Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full sm:w-auto"
          type="submit"
          isLoading={isSubmitting}
        >
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
