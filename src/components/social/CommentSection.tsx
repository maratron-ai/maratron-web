"use client";
import { useEffect, useState, FormEvent, useCallback } from "react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import { listComments, addComment } from "@lib/api/social";
import type { Comment } from "@maratypes/social";
import { Button, Input, Spinner } from "@components/ui";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

interface Props {
  postId: string;
  initialCount?: number;
  onCommentAdded?: () => void;
}

export default function CommentSection({
  postId,
  initialCount = 0,
  onCommentAdded,
}: Props) {
  const { profile } = useSocialProfile();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(initialCount);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listComments(postId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, fetchComments]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile || !text.trim()) return;
    setSubmitting(true);
    try {
      const comment = await addComment(postId, profile.id, text.trim());
      setComments((c) => [...c, comment]);
      setCount((c) => c + 1);
      onCommentAdded?.();
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <Button
        size="sm"
        variant={open ? "secondary" : "outline"}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-foreground bg-transparent no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
      >
        <MessageCircle className="w-4 h-4" />
        {count}
      </Button>
      {open && (
        <>
          {loading ? (
            <div className="flex justify-center py-2">
              <Spinner className="h-3 w-3" />
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2 text-sm">
                <Image
                  src={c.socialProfile?.avatarUrl || "/default_profile.png"}
                  alt={c.socialProfile?.username || "avatar"}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover border border-brand-to bg-brand-from"
                />
                <p>
                  <span className="font-semibold">
                    {c.socialProfile?.username}
                  </span>{" "}
                  {c.text}
                </p>
              </div>
            ))
          )}
          {profile && (
            <form onSubmit={onSubmit} className="flex gap-2 mt-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment"
                className="h-8"
              />
              <Button
                type="submit"
                size="sm"
                disabled={submitting || !text.trim()}
              >
                Post
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
