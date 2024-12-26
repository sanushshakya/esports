export interface ButtonTypes {
    onClick?: () => void;
    children: React.ReactNode;
    type?: "button" | "submit";
    className?: string;
  }