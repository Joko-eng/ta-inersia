import { getSession } from "@/lib/auth";
import { dbGetProjectsByManager } from "@/lib/services/projectAdminService";
import { redirect } from "next/navigation";
import ProjectList from "./components/ProjectList";

export default async function Page() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const projects = await dbGetProjectsByManager((session.user as any).id);

  return <ProjectList projects={projects} />;
}
