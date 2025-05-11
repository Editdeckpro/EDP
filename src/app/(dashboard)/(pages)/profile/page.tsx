import { authOptions } from "@/auth-guard";
import ChangePasswordDialog from "@/components/pages/profile/change-password-dialog";
import DeleteAccountDialog from "@/components/pages/profile/delete-account-dialog";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return;
  }

  return (
    <section>
      <section className="p-4 rounded-lg border border-primary/30 bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-5">
        <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-4">
          <div className="flex flex-col xs:flex-row gap-3">
            <Image
              src={"/images/pfp.jpg"}
              width={75}
              height={75}
              alt="User Profile Pic"
              className="rounded-xl aspect-square"
            />
            <div className="-space-y-1">
              <h1 className="text-2xl font-bold">John Smith</h1>
              <h2 className="font-medium text-primary">
                {session.user?.username}
              </h2>
              <h3 className="text-muted-foreground break-words">
                emailadress123@gmail.com
              </h3>
            </div>
          </div>
          <Link href={"/profile/edit"}>
            <Button className="w-full md:w-auto">Edit Profile</Button>
          </Link>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <ChangePasswordDialog />
          <DeleteAccountDialog />
        </div>
      </section>
    </section>
  );
}
