import { authOptions } from "@/auth-guard";
import EditProfileForm from "@/components/pages/profile/edit/edit-profile-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  return (
    <section className="space-y-5">
      <EditProfileForm session={session} />
    </section>
  );
}
