import styles from "../page.module.css";

interface MeetGreetSectionProps {
  name: string;
  email: string;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
}

export default function MeetGreetSection({
  name,
  email,
  onNameChange,
  onEmailChange,
}: MeetGreetSectionProps) {
  return (
    <section className={styles.meetGreetSection}>
      <h2 className={styles.sectionHeading}>Meet-and-Greet</h2>
      <p className={styles.meetGreetDesc}>
        Are you organizing a premium lifestyle exhibition, corporate gala, or an exclusive fashion event in Bangladesh? Partner with Murakkaz to bring a live olfactory blending station or an award-winning luxury pop-up stall to your venue.
      </p>

      <div className={styles.meetGreetFormContainer}>
        <h3 className={styles.meetGreetFormTitle}>Business Inquiries &amp; Meetup</h3>

        <div className={styles.formLayout}>
          {/* Row 1: Name, Company/Event Name, Book Button */}
          <div className={styles.formRow1}>
            <input
              type="text"
              className={styles.fieldInput}
              placeholder="Name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
            <input
              type="text"
              className={styles.fieldInput}
              placeholder="Company/Event Name"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
            />
            <button className={styles.submitBtn}>
              Book <span className={styles.btnArrow}>↗</span>
            </button>
          </div>

          {/* Row 2: Date, Location */}
          <div className={styles.formRow2}>
            <div className={styles.selectWrapper}>
              <select className={styles.fieldSelect} defaultValue="">
                <option value="" disabled>Date</option>
                <option value="nsu">05 July (NSU)</option>
                <option value="bracu">11 July (BRACU)</option>
                <option value="iccb">05 July (ICCB)</option>
              </select>
              <span className={styles.selectCaret}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            <input
              type="text"
              className={styles.fieldInput}
              placeholder="Location"
            />
          </div>

          {/* Row 3: Message Textarea */}
          <div className={styles.formRow3}>
            <textarea
              className={styles.fieldTextarea}
              placeholder="Message"
              rows={6}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
