/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateSocialPost from "../CreateSocialPost";
import { createPost } from "@lib/api/social";
import { useSocialProfile } from "@hooks/useSocialProfile";

jest.mock("@lib/api/social");
jest.mock("@hooks/useSocialProfile", () => ({ useSocialProfile: jest.fn() }));

const mockedCreate = createPost as jest.MockedFunction<typeof createPost>;
const mockedUseProfile = useSocialProfile as jest.Mock;

describe("CreateSocialPost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits post data", async () => {
    mockedUseProfile.mockReturnValue({ profile: { id: "p1" } });
    mockedCreate.mockResolvedValue({ id: "post1" } as any);
    const onCreated = jest.fn();
    const user = userEvent.setup();

    render(<CreateSocialPost onCreated={onCreated} />);

    await user.type(screen.getByLabelText(/distance/i), "3");
    await user.type(screen.getByLabelText(/time/i), "00:20:00");
    await user.type(screen.getByLabelText(/caption/i), "Nice run");
    await user.click(screen.getByRole("button", { name: /post/i }));

    expect(mockedCreate).toHaveBeenCalledWith({
      userProfileId: "p1",
      distance: 3,
      time: "00:20:00",
      caption: "Nice run",
      photoUrl: undefined,
    });
    expect(onCreated).toHaveBeenCalled();
    expect(await screen.findByText(/posted!/i)).toBeInTheDocument();
  });

  it("shows error when required fields missing", async () => {
    mockedUseProfile.mockReturnValue({ profile: { id: "p1" } });
    render(<CreateSocialPost />);

    const form = screen.getByRole("button", { name: /post/i }).closest("form")!;
    fireEvent.submit(form);

    expect(mockedCreate).not.toHaveBeenCalled();
    expect(await screen.findByText(/distance and time required/i)).toBeInTheDocument();
  });
});
