import PaceCalculator from "@components/PaceCalculator";
import CreateRun from "@components/CreateRun";
import AuthTest from "@components/AuthTest";
import PlanGenerator from "@components/PlanGenerator";

const ProfilePage = () => {
  return (
    <div>
      <h1>Profile Page</h1>
      <PaceCalculator />
      <hr />
      <CreateRun />
      <hr />
      <AuthTest />
      <hr />
      <PlanGenerator />
    </div>
  );
};

export default ProfilePage;
