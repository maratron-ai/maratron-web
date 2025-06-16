import CreateGroupForm from "@components/social/CreateGroupForm";

export default function NewGroupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center">
          <CreateGroupForm />
        </div>
      </main>
    </div>
  );
}
