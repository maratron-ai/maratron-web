import PaceCalculator from "@components/PaceCalculator";
import NewRunPage from "@components/NewRun";
import AuthTest from "@components/AuthTest";
import PlanGenerator from "@components/PlanGenerator";

const ProfilePage = () => {
  return (
    <div>
      <h1>Profile Page</h1>
      <PaceCalculator />
      <hr />
      <NewRunPage />
      <hr />
      <AuthTest />
      <hr />
      <PlanGenerator />
    </div>
  );
};

export default ProfilePage;
