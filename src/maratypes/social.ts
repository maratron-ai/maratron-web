export interface SocialProfile {
  id: string;
  userId: string;
  username: string;
  bio?: string | null;
  profilePhoto?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  name?: string | null;
  runCount?: number;
  totalDistance?: number;
  followerCount?: number;
  followingCount?: number;
}

export interface RunPost {
  id: string;
  socialProfileId: string;
  distance: number;
  time: string;
  caption?: string | null;
  photoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  socialProfile?: SocialProfile & { user?: { avatarUrl?: string } };
  likeCount?: number;
  commentCount?: number;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  socialProfileId: string;
  text: string;
  createdAt: Date;
  socialProfile?: SocialProfile;
}

export interface Like {
  id: string;
  postId: string;
  socialProfileId: string;
  createdAt: Date;
}
