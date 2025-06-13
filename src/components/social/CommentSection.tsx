"use client";
import { useEffect, useState, FormEvent, useCallback } from "react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import { listComments, addComment } from "@lib/api/social";
import type { Comment } from "@maratypes/social";
import { Button, Input } from "@components/ui";
import Image from "next/image";

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const { profile } = useSocialProfile();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const data = await listComments(postId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile || !text.trim()) return;
    setSubmitting(true);
    try {
      const comment = await addComment(postId, profile.id, text.trim());
      setComments((c) => [...c, comment]);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {loading ? (
        <p className="text-sm text-foreground/60">Loading comments...</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="flex items-start gap-2 text-sm">
            <Image
              src={c.socialProfile?.avatarUrl || "/default_profile.png"}
              alt={c.socialProfile?.username || "avatar"}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover"
            />
            <p>
              <span className="font-semibold">{c.socialProfile?.username}</span>{" "}
              {c.text}
            </p>
          </div>
        ))
      )}
      {profile && (
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment"
            className="h-8"
          />
          <Button type="submit" size="sm" disabled={submitting || !text.trim()}
            >
            Post
          </Button>
        </form>
      )}
    </div>
  );
}
