"use client";

import React from "react";
import ShoeForm from "@components/ShoeForm";
import { createShoe } from "@lib/api/shoe";
import { Shoe } from "@maratypes/shoe";
import { useSession } from "next-auth/react";

const CreateShoe: React.FC = () => {
  const { data: session, status } = useSession();

  const handleShoeSubmit = async (shoe: Shoe) => {
    if (!session?.user?.id) {
      alert("You must be logged in to add a shoe.");
      return;
    }
    try {
      // Attach the user's ID from the session
      const shoeWithUser: Shoe = {
        ...shoe,
        userId: session.user.id,
      };
      const createdShoe = await createShoe(shoeWithUser);
      console.log("Shoe created successfully:", createdShoe);
      // Optionally show a success message, redirect, or update UI
    } catch (error) {
      console.error("Error creating shoe:", error);
      // Handle error (show a notification, etc.)
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div>
      <h1>Add a New Shoe</h1>
      <ShoeForm onSubmit={handleShoeSubmit} />
    </div>
  );
};

export default CreateShoe;
