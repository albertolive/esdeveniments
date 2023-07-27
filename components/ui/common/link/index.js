import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveLink({ children, activeLinkClass, ...props }) {
  const { pathname } = useRouter();
  let className = children.props.className || "";

  if (pathname === props.href)
    className = `${
      activeLinkClass ? activeLinkClass : "text-[#ECB84A]"
    } ${className}`;

  return (
    <Link {...props} prefetch={false}>
      {React.cloneElement(children, { className })}
    </Link>
  );
}
