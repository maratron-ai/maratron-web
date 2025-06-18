import RunsList from "@components/runs/RunsList";

export default function RunsPage() {
  return (
    <div className="page-container p-4">
      <h1 className="text-2xl font-bold mb-4">All Runs</h1>
      <RunsList />
    </div>
  );
}
