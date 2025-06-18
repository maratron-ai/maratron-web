import ProfileSearch from "@components/social/ProfileSearch";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow page-main">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Find Runners</h1>
          <ProfileSearch />
        </div>
      </main>
    </div>
  );
}
