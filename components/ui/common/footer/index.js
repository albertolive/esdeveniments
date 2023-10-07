import React from "react";
import { SocialIcon } from "react-social-icons";
import ActiveLink from "@components/ui/common/link";
import Social from "@components/ui/common/social";

const navigation = [{ name: "Arxiu", href: "/sitemap", current: false }];

export default function Footer() {
  const links = {
    web: "https://www.esdeveniments.cat",
    twitter: "https://twitter.com/esdeveniments_",
    instagram: "https://www.instagram.com/esdevenimentscat/",
    telegram: "https://t.me/esdeveniments",
    facebook: "https://www.facebook.com/esdeveniments.cat/",
  };

  return (
    <footer className="md:sticky bottom-0 w-full flex flex-col justify-center items-center gap-4 bg-whiteCorp pb-24 pt-4 px-4 md:pb-8 md:pt-4 md:px-4">
      <Social links={links} />
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-xs">
        <a
          className="hover:text-primary underline"
          href="mailto:hola@esdeveniments.cat"
        >
          hola@esdeveniments.cat
        </a>
        <a>© {new Date().getFullYear()} Esdeveniments.cat</a>
        <div className="pt-4">
          {navigation.map((item) => (
            <ActiveLink href={item.href} key={item.name}>
              <a className="font-medium px-4">{item.name}</a>
            </ActiveLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
