import SocialFeed from "@components/social/SocialFeed";

export default function FeedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow page-main">
        <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
        <SocialFeed />
      </main>
    </div>
  );
}
