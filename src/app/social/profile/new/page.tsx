import SocialProfileForm from "@components/social/SocialProfileForm";

export default function NewSocialProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow page-main">
        <div className="flex justify-center">
          <SocialProfileForm />
        </div>
      </main>
    </div>
  );
}
