"use client";

import React from "react";
import RunForm from "@components/runs/RunForm";
import { createRun } from "@lib/api/run";
import { Run } from "@maratypes/run";

const CreateRun: React.FC = () => {

  const handleRunSubmit = async (run: Run) => {
    console.log("TEST");
    try {
      // attach the current user's ID here
      // For example, if you have an auth hook:
      // run.socialProfileId = currentUserId;

      const createdRun = await createRun(run);
      console.log("Run created successfully:", createdRun);
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

export default CreateRun;
