import DashboardHeader from "@/components/layout/header";
import GenerateSidebar from "./sidebar";

export default function Generate() {
  return (
    <section className="flex flex-col lg:flex-row">
      <section className="hidden lg:block p-5 lg:pr-0 min-w-1/4 ">
        <GenerateSidebar />
      </section>
      <section className="p-5 space-y-5  w-full">
        <DashboardHeader />
        <p>content</p>
      </section>
    </section>
  );
}
