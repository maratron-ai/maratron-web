import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SocialFeed from "../SocialFeed";
import { useSession } from "next-auth/react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import axios from "axios";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@hooks/useSocialProfile", () => ({ useSocialProfile: jest.fn() }));
jest.mock("axios");

jest.mock("@components/CreateSocialPost", () => ({ __esModule: true, default: () => <div data-testid="create-post" /> }));

const mockedSession = useSession as jest.Mock;
const mockedUseProfile = useSocialProfile as jest.Mock;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SocialFeed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requires login", () => {
    mockedSession.mockReturnValue({ data: null });
    mockedUseProfile.mockReturnValue({ profile: null, loading: false });
    render(<SocialFeed />);
    expect(screen.getByText(/please log in/i)).toBeInTheDocument();
  });

  it("shows posts", async () => {
    mockedSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockedUseProfile.mockReturnValue({ profile: { id: "p1" }, loading: false });
    mockedAxios.get.mockResolvedValue({ data: [{ id: "post1", distance: 3, time: "00:20:00", userProfile: { username: "tester" } }] });

    render(<SocialFeed />);

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledWith("/api/social/feed?userId=u1"));

    expect(await screen.findByText(/tester/)).toBeInTheDocument();
    expect(screen.getByText(/3 mi in 00:20:00/)).toBeInTheDocument();
  });
});
