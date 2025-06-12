import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FollowUserButton from "../FollowUserButton";
import { followUser } from "@lib/api/social";
import { useSession } from "next-auth/react";
import { useSocialProfile } from "@hooks/useSocialProfile";

jest.mock("@lib/api/social");
jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@hooks/useSocialProfile", () => ({ useSocialProfile: jest.fn() }));

const mockedFollow = followUser as jest.MockedFunction<typeof followUser>;
const mockedSession = useSession as jest.Mock;
const mockedUseProfile = useSocialProfile as jest.Mock;

describe("FollowUserButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("follows another user", async () => {
    mockedSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockedUseProfile.mockReturnValue({ profile: { id: "p1" } });
    mockedFollow.mockResolvedValue();
    const user = userEvent.setup();

    render(<FollowUserButton profileId="p2" />);

    const btn = screen.getByRole("button", { name: /follow/i });
    await user.click(btn);

    expect(mockedFollow).toHaveBeenCalledWith("p1", "p2");
    expect(btn).toBeDisabled();
    expect(await screen.findByText(/following/i)).toBeInTheDocument();
  });
});
