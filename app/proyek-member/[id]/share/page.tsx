import "@/models/TeamMember";
import { fetchSharePageData } from "./action";
import ShareTaskView from "./share-task";

export default async function SharePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const data = await fetchSharePageData(id);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Proyek tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <ShareTaskView
      projectName={data.projectName}
      tasks={data.tasks}
      milestones={data.milestones}
    />
  );
}
