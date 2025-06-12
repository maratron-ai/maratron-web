import ProfileSearch from "@components/ProfileSearch";

export default function SearchPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Find Runners</h1>
        <ProfileSearch />
      </div>
    </div>
  );
}
