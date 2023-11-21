import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveLink({ children, activeLinkClass, ...props }) {
  const { pathname } = useRouter();
  let className = children.props.className || "";

  if (pathname === props.href)
    className = `${
      activeLinkClass ? activeLinkClass : "text-primary bg-whiteCorp rounded-xl p-0 ease-in-out duration-200 border border-whiteCorp"
    } ${className}`;

  return (
    <Link {...props} prefetch={false} legacyBehavior>
      {React.cloneElement(children, { className })}
    </Link>
  );
}
