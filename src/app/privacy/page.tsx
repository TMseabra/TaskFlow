import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Privacy - TaskFlow" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        TaskFlow is a portfolio project. This page explains, simply and
        honestly, what data we store and what it is used for.
      </p>
      <h2>What we store</h2>
      <p>
        Name, email and (if you use password login) an encrypted password —
        never stored as plain text. If you sign in with Google or GitHub, we
        only store what those accounts share (name, email, profile picture).
        We also store the tasks you create: title, description, status,
        priority and due date.
      </p>
      <h2>What we use the data for</h2>
      <p>
        Only to make the app work: authenticating you and showing you your
        own tasks. We never sell or share your data with third parties, and
        we never use it for advertising.
      </p>
      <h2>How long we keep it</h2>
      <p>
        Until you delete your account. In Settings you can permanently delete
        your account and all your tasks at any time.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about your data? Write to{" "}
        <a href="mailto:tseabra@outlook.pt" className="font-semibold text-ink hover:underline">
          tseabra@outlook.pt
        </a>
        .
      </p>
    </LegalPage>
  );
}
