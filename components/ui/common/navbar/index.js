import { useState, useEffect } from "react";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import MenuIcon from "@heroicons/react/outline/MenuIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import PlusSmIcon from "@heroicons/react/outline/PlusSmIcon";
import HomeIcon from "@heroicons/react/outline/HomeIcon";
import InformationCircleIcon from "@heroicons/react/outline/InformationCircleIcon";
import Image from "next/image";
import ActiveLink from "@components/ui/common/link";
import logo from "@public/static/images/logo-esdeveniments.png";
import { useRouter } from "next/router";

const navigation = [
  { name: "Agenda", href: "/", current: true },
  { name: "Publicar", href: "/publica", current: false },
  { name: "Qui som", href: "/qui-som", current: false },
];

export default function Navbar() {
  const [hasShadow, setHasShadow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasShadow(true);
      } else {
        setHasShadow(false);
      }
    };

    // Run the function once to handle the initial scroll position
    handleScroll();

    // Add the event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const navigateToMainPage = () => {
    localStorage.removeItem("place");
    localStorage.removeItem("byDate");
    localStorage.removeItem("distance");
    localStorage.removeItem("currentPage");
    localStorage.removeItem("searchTerm");
    localStorage.removeItem("scrollPosition");
  };

  const reloadPage = () => {
    // Delay the page reload after navigation is complete
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleLogoClick = () => {
    navigateToMainPage();
    // reloadPage();
  };

  return (
    <Disclosure
      key={router.asPath}
      as="nav"
      className={`navbar bg-whiteCorp sticky top-0 z-50 ${
        hasShadow
          ? "shadow-sm shadow-whiteCorp transition-all ease-in-out duration-300"
          : ""
      }`}
    >
      {({ open }) => (
        <>
          <div className="bg-whiteCorp mx-auto h-18 p-3 lg:max-w-[1024px] xl:max-w-[1280px]">
            <div className="flex flex-col justify-center h-full">
              {/* FirstBar - Logo&LaptopMenu&MenuIcon */}
              <div className="flex justify-around items-center">
                {/* Logo */}
                <div
                  className="flex w-full md:w-1/2 justify-start items-center py-2 px-3 cursor-pointer"
                  onClick={handleLogoClick}
                >
                  <Link href="/">
                    <a>
                      <Image
                        src={logo}
                        className="block cursor-pointer bg-whiteCorp py-2 px-4"
                        alt="Logo Esdeveniments.cat"
                        width={168}
                        height={20}
                        layout="fixed"
                        priority
                      />
                    </a>
                  </Link>
                </div>
                {/* MenuIcon */}
                <div className="flex items-center md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center py-2 px-3 focus:outline-none">
                    {/* <span className="sr-only">Obrir menú principal</span> */}
                    {open ? (
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                {/* LaptopMenu */}
                <div className="md:w-1/2 flex justify-end items-center">
                  <div className="hidden md:flex md:items-center gap-x-4">
                    {navigation.map((item) => (
                      <ActiveLink
                        href={item.href}
                        key={item.name}
                        className="focus:outline-none cursor-pointer"
                      >
                        <a className="text-center text-base font-semibold px-4 w-24 font-barlow italic uppercase">
                          {item.name}
                        </a>
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              {/* SecondBar - Search&Share&MenuIcon */}
              <div
                className="fixed h-content bottom-0 left-0 right-0 p-2 bg-whiteCorp flex justify-evenly items-center gap-x-16
              md:hidden
              "
              >
                {/* Home */}
                <div
                  className="flex justify-center items-center rounded-xl cursor-pointer"
                  onClick={handleLogoClick}
                >
                  <ActiveLink href="/">
                    <button
                      type="button"
                      className="flex items-center p-2 focus:outline-none cursor-pointer rounded-xl"
                    >
                      <HomeIcon className="h-6 w-6" />
                    </button>
                  </ActiveLink>
                </div>

                {/* Share */}
                <div className="flex justify-center items-center rounded-xl cursor-pointer">
                  <ActiveLink href="/publica">
                    <button
                      type="button"
                      className="flex items-center p-2 focus:outline-none cursor-pointer rounded-xl"
                    >
                      <PlusSmIcon className="h-6 w-6" aria-hidden="true" />
                      <span className="hidden sm:visible">Publica</span>
                    </button>
                  </ActiveLink>
                </div>

                {/* WhoAreWe */}
                <div className="flex justify-center items-center rounded-xl cursor-pointer">
                  <ActiveLink href="/qui-som">
                    <button
                      type="button"
                      className="flex items-center p-2 focus:outline-none cursor-pointer rounded-xl"
                    >
                      <InformationCircleIcon className="h-6 w-6" />
                    </button>
                  </ActiveLink>
                </div>
              </div>
            </div>
          </div>
          {/* MenuPanel (md:hidden) */}
          <Disclosure.Panel className="md:hidden">
            <div className="fixed flex justify-center items-center gap-4 px-4 pb-5 bg-whiteCorp transition-transform">
              {navigation.map((item) => (
                <ActiveLink href={item.href} key={item.name}>
                  <a className="flex justify-center items-center font-semibold px-4 py-1 font-barlow italic uppercase">
                    {item.name}
                  </a>
                </ActiveLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
