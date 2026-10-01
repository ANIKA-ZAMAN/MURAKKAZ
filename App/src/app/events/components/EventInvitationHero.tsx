"use client";

import Image from "next/image";
import styles from "../page.module.css";

interface EventInvitationHeroProps {
  onOpenPhoto?: (photo: { url: string; title: string; location?: string; date?: string }) => void;
}

export default function EventInvitationHero({ onOpenPhoto }: EventInvitationHeroProps) {
  const invitationSrc = "/images/events/her_etrade_invitation.png";
  const title = "Her e-Trade Exhibition; Sharadiya Abahon — Invitation";
  const location = "Midas Centre, Dhanmondi 27, Dhaka";
  const date = "2 & 3 October 2026";

  return (
    <section className={styles.heroInvitationSection} aria-label="Official Event Invitation">
      <div
        className={styles.heroInvitationFrame}
        onClick={() => {
          if (onOpenPhoto) {
            onOpenPhoto({
              url: invitationSrc,
              title,
              location,
              date,
            });
          }
        }}
        role={onOpenPhoto ? "button" : undefined}
        tabIndex={onOpenPhoto ? 0 : undefined}
        onKeyDown={(e) => {
          if (onOpenPhoto && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onOpenPhoto({
              url: invitationSrc,
              title,
              location,
              date,
            });
          }
        }}
        style={{ cursor: onOpenPhoto ? "pointer" : "default" }}
        title={onOpenPhoto ? "Click to view full invitation" : undefined}
      >
        <Image
          src={invitationSrc}
          alt="Her e-Trade Exhibition; Sharadiya Abahon Invitation — 2 & 3 October 2026 at Midas Centre, Dhanmondi 27, Dhaka"
          width={1024}
          height={835}
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1024px"
          className={styles.heroInvitationImage}
        />
      </div>
    </section>
  );
}
