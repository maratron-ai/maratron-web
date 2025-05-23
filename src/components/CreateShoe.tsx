"use client";

import React from "react";
import ShoeForm from "@components/ShoeForm"; // You’ll need a form similar to RunForm
import { createShoe } from "@lib/api/shoe"; // Your API call function
import { Shoe } from "@maratypes/shoe";
// import { useUserStore } from "@store/userStore"; // Adjust import path

const CreateShoe: React.FC = () => {

  const handleShoeSubmit = async (shoe: Shoe) => {
    try {
      // if (!user?.id) throw new Error("User not authenticated!!!");
      // // Attach the user's ID
      // const shoeWithUser: Shoe = {
      //   ...shoe,
      //   userId: user.id,
      // };

      const createdShoe = await createShoe(shoe);
      console.log("Shoe created successfully:", createdShoe);
      // Optionally: Show a success message, redirect, or update UI
    } catch (error) {
      console.error("Error creating shoe:", error);
      // Handle error (show a notification, etc.)
    }
  };

  return (
    <div>
      <h1>Add a New Shoe</h1>
      <ShoeForm onSubmit={handleShoeSubmit} />
    </div>
  );
};

export default CreateShoe;
