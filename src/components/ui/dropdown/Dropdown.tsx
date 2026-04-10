import { useState, useRef, useEffect } from "react";

import styles from "./Dropdown.module.css";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

let activeDropdown: HTMLElement | null = null;

export const Dropdown = ({ trigger, children }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        if (activeDropdown === ref.current) {
          activeDropdown = null;
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = () => {
    if (!open && activeDropdown && activeDropdown !== ref.current) {
      const prevOpen = document.querySelector(`.${styles.dropdownMenu}`);
      if (prevOpen) {
        const event = new MouseEvent("mousedown", { bubbles: true });
        document.dispatchEvent(event);
      }
    }

    setOpen(!open);
    if (!open) {
      activeDropdown = ref.current;
    } else {
      activeDropdown = null;
    }
  };

  return (
    <div ref={ref} className={styles.dropdown}>
      <div onClick={handleClick}>{trigger}</div>

      {open && <div className={styles.dropdownMenu}>{children}</div>}
    </div>
  );
};
