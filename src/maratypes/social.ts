export interface SocialUserProfile {
  id: string;
  userId: string;
  username: string;
  bio?: string;
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  runCount?: number;
  totalDistance?: number;
  followerCount?: number;
  followingCount?: number;
}

export interface RunPost {
  id: string;
  userProfileId: string;
  distance: number;
  time: string;
  caption?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  userProfile?: SocialUserProfile;
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
  userProfileId: string;
  text: string;
  createdAt: Date;
  userProfile?: SocialUserProfile;
}

export interface Like {
  id: string;
  postId: string;
  userProfileId: string;
  createdAt: Date;
}
