"use client";

import React from "react";
import RunForm from "@components/RunForm";
import { createRun } from "@lib/api/run";
import { Run } from "@maratypes/run";

import { useUserStore } from "@store/userStore"; // Adjust the import path as necessary


const CreateRun: React.FC = () => {

  const user = useUserStore((state) => state.user);

  console.log("User from store:", user);

  const handleRunSubmit = async (run: Run) => {

    console.log("TEST")
    try {
      // attach the current user's ID here
      // For example, if you have an auth hook:
      // run.userProfileId = currentUserId;

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
