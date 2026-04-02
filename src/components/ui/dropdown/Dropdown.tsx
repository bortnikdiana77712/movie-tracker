import { useState, useRef, useEffect } from "react";

import styles from "./Dropdown.module.css";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const Dropdown = ({ trigger, children }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={styles.dropdown}>
      <div
        onClick={(e) => {
          e.stopPropagation();//предотвращает всплытие
          setOpen(!open);
        }}
      >
        {trigger}
      </div>

      {open && (
        <div
          className={styles.dropdownMenu}
          onClick={(e) => e.stopPropagation()} 
        >
          {children}
        </div>
      )}
    </div>
  );
};
