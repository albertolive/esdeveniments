import React from "react";
import ActiveLink from "@components/ui/common/link";
import Social from "@components/ui/common/social";

const navigation = [
  { name: "Agenda", href: "/", current: false },
  { name: "Publicar", href: "/publica", current: false },
  { name: "Qui som", href: "/qui-som", current: false },
  { name: "Arxiu", href: "/sitemap", current: false },
];

[];

export default function Footer() {
  const links = {
    web: "https://www.esdeveniments.cat",
    twitter: "https://twitter.com/esdeveniments_",
    instagram: "https://www.instagram.com/esdevenimentscat/",
    telegram: "https://t.me/esdeveniments",
    facebook: "https://www.facebook.com/esdeveniments.cat/",
  };

  return (
    <footer className="w-full flex justify-center items-center gap-4 border-t border-bColor bg-whiteCorp pb-16 pt-2 px-6 md:pb-8 md:pt-4 md:px-4">
      <div className="w-full flex flex-col justify-center align-center gap-4">
        <Social links={links} />
        <div className="flex flex-col justify-center items-center gap-8 text-xs">
          <div className="flex justify-center items-center gap-6">
            {navigation.map((item) => (
              <ActiveLink href={item.href} key={item.name}>
                <a className="font-semibold">{item.name}</a>
              </ActiveLink>
            ))}
          </div>
          <div className="w-full flex justify-center px-6">
            © {new Date().getFullYear()} Esdeveniments.cat
          </div>
        </div>
      </div>
    </footer>
  );
}
