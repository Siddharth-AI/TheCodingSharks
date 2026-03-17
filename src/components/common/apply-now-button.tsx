"use client";

import { openLeadModal } from "./lead-modal";

interface Props {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  source?: string;
}

export function ApplyNowButton({ children = "Apply Now — Free", className = "", style, source }: Props) {
  return (
    <button
      type="button"
      onClick={() => openLeadModal(source)}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}

export function BrochureButton({ children, className = "", style, source }: Props) {
  return (
    <button
      type="button"
      onClick={() => openLeadModal(source ?? "brochure")}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}
