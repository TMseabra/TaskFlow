import type { ActivityType } from "@prisma/client";
import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

export function actorName(session: Session) {
  const name = session.user.name?.trim();
  return name ? name.split(/\s+/)[0] : "You";
}

export async function logActivity(
  session: Session,
  type: ActivityType,
  subject: string
) {
  await prisma.activity.create({
    data: {
      userId: session.user.id,
      actor: actorName(session),
      type,
      subject,
    },
  });
}
