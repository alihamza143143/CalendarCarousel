"use client";
import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import styles from './ContactCard.module.css';

const ContactCard: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.contactCardWrapper}>
      <button
        className={styles.fab}
        onClick={() => setShow((s) => !s)}
        aria-label="Show contact info"
      >
        <FaUser className={styles.fabIcon} />
      </button>
      <div className={show ? styles.popupShow : styles.popupHide}>
        <div className={styles.card}>
          <div className={styles.animatedText}>
            Ali Hamza Tariq
            <span className={styles.subtitle}>Creative Developer</span>
          </div>
          <a
            className={styles.infoRow}
            href="https://wa.me/923099715569"
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp or Call"
          >
            <FaPhone className={styles.icon} />
            <span>00923099715569</span>
          </a>
          <a
            className={styles.infoRow}
            href="mailto:alihamza891840@gmail.com"
            title="Send Email"
          >
            <FaEnvelope className={styles.icon} />
            <span>alihamza891840@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
