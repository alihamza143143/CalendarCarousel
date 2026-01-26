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
          <div className={styles.animatedText}>Ali Hamza Tariq</div>
          <div className={styles.infoRow}>
            <FaPhone className={styles.icon} />
            <span>00923099715569</span>
          </div>
          <div className={styles.infoRow}>
            <FaEnvelope className={styles.icon} />
            <span>alihamza891840@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
