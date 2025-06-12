"use client";
import { useState, FormEvent } from "react";
import { createPost } from "@lib/api/social";
import { useSocialProfile } from "@hooks/useSocialProfile";
import { Card, Button } from "@components/ui";
import { TextField, TextAreaField } from "@components/ui/FormField";

interface Props {
  onCreated?: () => void;
}

export default function CreateSocialPost({ onCreated }: Props) {
  const { profile } = useSocialProfile();
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [caption, setCaption] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!profile) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!distance || !time) {
      setError("Distance and time required");
      return;
    }
    try {
      await createPost({
        userProfileId: profile.id,
        distance: parseFloat(distance),
        time,
        caption: caption || undefined,
        photoUrl: photoUrl || undefined,
      });
      setSuccess("Posted!");
      setDistance("");
      setTime("");
      setCaption("");
      setPhotoUrl("");
      onCreated?.();
    } catch {
      setError("Failed to create post");
    }
  };

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2">Share a Run</h3>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-primary mb-2">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <TextField
          label="Distance (mi)"
          name="distance"
          type="number"
          value={distance}
          onChange={(_n, v) => setDistance(String(v))}
          required
        />
        <TextField
          label="Time (HH:MM:SS)"
          name="time"
          value={time}
          onChange={(_n, v) => setTime(String(v))}
          required
        />
        <TextAreaField
          label="Caption"
          name="caption"
          value={caption}
          onChange={(_n, v) => setCaption(String(v))}
          rows={2}
        />
        <TextField
          label="Photo URL"
          name="photoUrl"
          value={photoUrl}
          onChange={(_n, v) => setPhotoUrl(String(v))}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            Post
          </Button>
        </div>
      </form>
    </Card>
  );
}
