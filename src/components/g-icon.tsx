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
  const sizePx = typeof size === "number" ? `${size}px` : size;
  return (
    <span
      className={`material-symbols-outlined g-icon-contain ${className}`}
      style={{
        fontSize: size,
        width: sizePx,
        minWidth: sizePx,
        height: sizePx,
        ...style,
      }}
      aria-hidden="true"
    >
      {name ?? children}
    </span>
  );
}
