import { useRef } from "react";

export default function StickySection({
  children,
  className = "",
  top = 100,
  as = "div",
  ...rest
}) {
  const Tag = as;
  return (
    <Tag
      className={"sticky " + className}
      style={{ top: `${top}px` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
