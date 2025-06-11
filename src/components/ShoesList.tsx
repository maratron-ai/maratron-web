"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { listShoes } from "@lib/api/shoe";
import { updateUserProfile } from "@lib/api/user/user";
import { useUserProfile } from "@hooks/useUserProfile";
import type { Shoe } from "@maratypes/shoe";
import { Card, Button } from "@components/ui";

export default function ShoesList() {
  const { data: session } = useSession();
  const { profile } = useUserProfile();
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultId, setDefaultId] = useState<string | undefined>();

  useEffect(() => {
    setDefaultId(profile?.defaultShoeId);
  }, [profile?.defaultShoeId]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;
    listShoes()
      .then((all) => {
        const userShoes = (all as Shoe[]).filter((s) => s.userId === userId);
        setShoes(userShoes);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const setDefault = async (id: string) => {
    if (!session?.user?.id) return;
    try {
      await updateUserProfile(session.user.id, { defaultShoeId: id });
      setDefaultId(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-foreground/60">Loading shoes...</p>;
  if (shoes.length === 0)
    return <p className="text-foreground/60">No shoes added.</p>;

  return (
    <div className="space-y-2">
      {shoes.map((shoe) => {
        const isDefault = shoe.id === defaultId;
        return (
          <Card key={shoe.id} className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{shoe.name}</p>
              <div className="text-sm">
                <span>
                  {shoe.createdAt
                    ? new Date(shoe.createdAt).toLocaleDateString()
                    : ""}
                </span>
                <span className="ml-2">
                  {shoe.currentDistance} / {shoe.maxDistance} {shoe.distanceUnit}
                </span>
                {isDefault && (
                  <span className="ml-2 text-primary font-medium">default</span>
                )}
              </div>
            </div>
            {!isDefault && shoe.id && (
              <Button
                onClick={() => setDefault(shoe.id!)}
                className="text-sm px-2 py-1"
              >
                Make Default
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
