"use client";

import { useUserStore } from "@store/userStore";
import { useAuth } from "@hooks/useAuth";
import Image from "next/image";

const UserProfilePage = () => {
  const { user } = useUserStore();
  const { logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Please log in or create a profile to view your information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Header: Most important info at the top */}
      <div className="flex items-center mb-8">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl || "/default-avatar.png"}
            alt={`${user.name}'s avatar`}
            width={96}
            height={96}
            className="rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mr-4">
            <span className="text-2xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{user.name || "Unnamed User"}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Basic Information */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Age:</strong> {user.age ?? "N/A"}
          </div>
          <div>
            <strong>Gender:</strong> {user.gender || "N/A"}
          </div>
          <div>
            <strong>Training Level:</strong> {user.trainingLevel || "N/A"}
          </div>
          <div>
            <strong>VO2 Max:</strong> {user.VO2Max ?? "N/A"}
          </div>
        </div>
      </section>

      {/* Physical Stats */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Physical Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Height:</strong>{" "}
            {user.height ? `${user.height} inches` : "N/A"}
          </div>
          <div>
            <strong>Weight:</strong>{" "}
            {user.weight ? `${user.weight} lbs` : "N/A"}
          </div>
          <div>
            <strong>Years Running:</strong> {user.yearsRunning ?? "N/A"}
          </div>
          <div>
            <strong>Weekly Mileage:</strong>{" "}
            {user.weeklyMileage ? `${user.weeklyMileage} miles` : "N/A"}
          </div>
        </div>
      </section>

      {/* Training & Goals */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Training & Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Goals:</strong>{" "}
            {user.goals && user.goals.length > 0
              ? user.goals.join(", ")
              : "N/A"}
          </div>
          <div>
            <strong>Injury History:</strong> {user.injuryHistory || "N/A"}
          </div>
        </div>
      </section>

      {/* Preferences & Device */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preferences & Device</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Preferred Training Days:</strong>{" "}
            {user.preferredTrainingDays || "N/A"}
          </div>
          <div>
            <strong>Preferred Environment:</strong>{" "}
            {user.preferredTrainingEnvironment || "N/A"}
          </div>
          <div>
            <strong>Device:</strong> {user.device || "N/A"}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfilePage;
