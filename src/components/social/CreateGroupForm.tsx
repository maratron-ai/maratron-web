"use client";
import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import { createGroup } from "@lib/api/social";
import { Card, Button, Switch } from "@components/ui";
import { TextField, TextAreaField } from "@components/ui/FormField";

export default function CreateGroupForm() {
  const { data: session } = useSession();
  const { profile } = useSocialProfile();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!session?.user?.id) {
      setError("Login required");
      return;
    }
    if (!profile?.id || !name) {
      setError("Group name required");
      return;
    }
    try {
      await createGroup({
        name,
        description: description || undefined,
        private: isPrivate,
        ownerId: profile.id,
      });
      setSuccess("Group created!");
      setName("");
      setDescription("");
      setIsPrivate(false);
    } catch {
      setError("Failed to create group");
    }
  };

  return (
    <Card className="p-6 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Create Run Group</h2>
      {error && <p className="text-brand-orange-dark mb-2">{error}</p>}
      {success && <p className="text-primary mb-2">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Name"
          name="name"
          value={name}
          onChange={(_n, v) => setName(String(v))}
          required
        />
        <TextAreaField
          label="Description"
          name="description"
          value={description}
          onChange={(_n, v) => setDescription(String(v))}
          rows={2}
        />
        <div className="flex items-center gap-2">
          <Switch
            id="private"
            checked={isPrivate}
            onCheckedChange={(v) => setIsPrivate(v)}
          />
          <label htmlFor="private" className="text-sm">
            Private group
          </label>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Create Group</Button>
        </div>
      </form>
    </Card>
  );
}
