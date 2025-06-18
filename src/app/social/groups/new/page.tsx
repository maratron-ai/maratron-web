import CreateGroupForm from "@components/social/CreateGroupForm";

export default function NewGroupPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-container py-8 flex justify-center">
        <CreateGroupForm />
      </main>
    </div>
  );
}
