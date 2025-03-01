import UserProfileForm from "@components/UserProfileForm";
import PaceCalculator from "@components/PaceCalculator";
import NewRunPage from "@pages/new-run";
import AuthTest from "@components/AuthTest";

const ProfilePage = () => {
  return (
    <div>
      <h1>Profile Page</h1>
      <UserProfileForm />
      <hr />
      <PaceCalculator />
      <hr />
      <NewRunPage />
      <hr />
      <AuthTest />
    </div>
  );
};

export default ProfilePage;
