import SocialFeed from "@components/SocialFeed";

export default function FeedPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
      <SocialFeed />
    </div>
  );
}
