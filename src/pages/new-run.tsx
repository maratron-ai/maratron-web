import React from "react";
import RunForm from "@components/RunForm"; // adjust the path as needed
import { createRun } from "@lib/api/run"; // your API function for creating a run
import { Run } from "@maratypes/run";

const NewRunPage: React.FC = () => {
  // This function is called when the form is successfully submitted.
  // It calls the API helper to send the run data to your backend.
  const handleRunSubmit = async (run: Run) => {
    try {
      // Optionally, you can attach the current user's ID here
      // For example, if you have an auth hook:
      // run.userProfileId = currentUserId;

      const createdRun = await createRun(run);
      console.log("Run created successfully:", createdRun);
      // You could redirect the user, show a success message, or update local state here.
    } catch (error) {
      console.error("Error creating run:", error);
      // Handle error (show a notification, etc.)
    }
  };

  return (
    <div>
      <h1>Create a New Run</h1>
      <RunForm onSubmit={handleRunSubmit} />
    </div>
  );
};

export default NewRunPage;

