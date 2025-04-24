import React from "react";

type IconBaseProps = {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

type IconWithName = IconBaseProps & {
  name: string;
  children?: never;
};

type IconWithChildren = IconBaseProps & {
  name?: never;
  children: string;
};

type IconProps = IconWithName | IconWithChildren;

export default function GIcon({
  name,
  size = 24,
  className = "",
  style = {},
  children,
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: size, ...style }}
      aria-hidden="true"
    >
      {name ?? children}
    </span>
  );
}
