import React from "react";
import { SocialIcon } from "react-social-icons";
import ActiveLink from "@components/ui/common/link";

const navigation = [{ name: "Arxiu", href: "/sitemap", current: false }];

export default function Footer() {
  return (
    <footer className="bg-whiteCorp flex flex-col justify-center items-center gap-4 pt-4 pb-24">
        <div className="flex flex-col md:flex-row justify-evenly items-center h-full text-[13px] gap-4">
            <div className="flex justify-center items-center gap-x-8">
              {/* It is missing to define the name of the "esdeveniments" profile or channel in each url */}
                <SocialIcon url="https://twitter.com" target="_blanc" bgColor="#FFF" fgColor="#FF0037" style={{ height: 50, width: 50  }} />
                <SocialIcon url="https://facebook.com" target="_blanc" bgColor="#FFF" fgColor="#FF0037" style={{ height: 50, width: 50 }} />
                <SocialIcon url="https://instagram.com" target="_blanc" bgColor="#FFF" fgColor="#FF0037" style={{ height: 50, width: 50 }} />
                <SocialIcon url="https://web.telegram.org/k/" target="_blanc" bgColor="#FFF" fgColor="#FF0037" style={{ height: 50, width: 50 }} />
            </div>
        </div>
        <div className="flex justify-center items-center gap-4 text-[13px]">
          <a>© {new Date().getFullYear()} Esdeveniments.cat</a>
          <p>|</p>
          <a className="hover:text-primary" href="mailto:hola@esdeveniments.cat">hola@esdeveniments.cat</a>
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
