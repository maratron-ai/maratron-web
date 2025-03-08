// @component/ToggleSwitch.tsx

"use client";

import React from "react";
import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  leftLabel = "Supply",
  rightLabel = "Borrow",
}) => {
  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className={styles.input}
      />
      <span className={styles.slider}>
        <span className={styles.labelLeft}>{leftLabel}</span>
        <span className={styles.labelRight}>{rightLabel}</span>
      </span>
    </label>
  );
};

export default ToggleSwitch;


