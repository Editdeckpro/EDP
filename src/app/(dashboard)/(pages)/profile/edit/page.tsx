import EditProfileForm from "@/components/pages/profile/edit/edit-profile-form";
import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();

  if (!session) redirect("/login");
  return (
    <section className="space-y-5">
      <EditProfileForm session={session} />
    </section>
  );
}
