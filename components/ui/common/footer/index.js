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
    <footer className="m-auto px-4 xs:px-4 xs:max-w-full sm:px-4 sm:max-w-[576px] md:px-10 md:max-w-[768px] lg:px-20 lg:max-w-[1024px] bg-whiteCorp flex flex-col justify-center items-center gap-8 pt-4 pb-24">
      <Social links={links} />
      {/* <div className="flex flex-col md:flex-row justify-evenly items-center w-full h-full text-[13px] gap-4">
        <div className="flex justify-center items-center gap-x-8">
          <SocialIcon
            url="https://twitter.com"
            target="_blanc"
            bgColor="#FFF"
            fgColor="#FF0037"
            style={{ height: 50, width: 50 }}
          />
          <SocialIcon
            url="https://facebook.com"
            target="_blanc"
            bgColor="#FFF"
            fgColor="#FF0037"
            style={{ height: 50, width: 50 }}
          />
          <SocialIcon
            url="https://instagram.com"
            target="_blanc"
            bgColor="#FFF"
            fgColor="#FF0037"
            style={{ height: 50, width: 50 }}
          />
          <SocialIcon
            url="https://web.telegram.org/k/"
            target="_blanc"
            bgColor="#FFF"
            fgColor="#FF0037"
            style={{ height: 50, width: 50 }}
          />
        </div>
      </div> */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-xs">
        <a className="hover:text-primary" href="mailto:hola@esdeveniments.cat">
          hola@esdeveniments.cat
        </a>
        <a>© {new Date().getFullYear()} Esdeveniments.cat</a>
        {/* <div className="pt-4">
              {navigation.map((item) => (
                <ActiveLink href={item.href} key={item.name}>
                  <a className="font-medium px-4">{item.name}</a>
                </ActiveLink>
              ))}
            </div> */}
      </div>
    </footer>
  );
}
