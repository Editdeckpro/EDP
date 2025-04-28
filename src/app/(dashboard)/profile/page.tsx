import ChangePasswordDialog from "@/components/pages/profile/change-password-dialog";
import DeleteAccountDialog from "@/components/pages/profile/delete-account-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <section>
      <section className="p-4 rounded-lg border border-primary/30 bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-5">
        <div className="flex  items-center justify-between">
          <div className="flex gap-3">
            <Image
              src={"/images/pfp.jpg"}
              width={75}
              height={75}
              alt="User Profile Pic"
              className="rounded-xl aspect-square"
            />
            <div className="-space-y-1">
              <h1 className="text-2xl font-bold">John Smith</h1>
              <h2 className="font-medium text-primary">HSung15</h2>
              <h3 className="text-muted-foreground">
                emailadress123@gmail.com
              </h3>
            </div>
          </div>
          <Link href={"/profile/edit"}>
            <Button>Edit Profile</Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <ChangePasswordDialog />
          <DeleteAccountDialog />
        </div>
      </section>
    </section>
  );
}
