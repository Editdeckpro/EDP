import ChangePasswordDialog from "@/components/pages/profile/change-password-dialog";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/auth-server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
// import DeleteAccountDialog from "@/components/pages/profile/delete-account-dialog";

export default async function Page() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  return (
    <main>
      <section className="p-4 rounded-lg border border-primary/30 bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-5 relative">
        <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-4">
          <div className="flex flex-col xs:flex-row gap-3">
            <Image
              src={session.user.profileImage || "/images/pfp.jpg"}
              width={75}
              height={75}
              alt="User Profile Pic"
              className="rounded-xl aspect-square"
            />
            <div className="-space-y-1">
              <h1 className="text-2xl font-bold">
                <span>{session.user.firstName}</span>
                <span> {session.user.lastName}</span>
              </h1>
              <h2 className="font-medium text-primary">
                {session.user.username}
              </h2>
              <h3 className="text-muted-foreground break-words">
                {session.user.email}
              </h3>
            </div>
          </div>
          <Link href={"/profile/edit"}>
            <Button className="w-full md:w-auto">Edit Profile</Button>
          </Link>
        </div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          <ChangePasswordDialog />
          {/* <DeleteAccountDialog /> */}
        </div>
      </section>
    </main>
  );
}
