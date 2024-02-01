import { useRouter } from "next/router";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import MenuIcon from "@heroicons/react/outline/MenuIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import PlusSmIcon from "@heroicons/react/outline/PlusIcon";
import HomeIcon from "@heroicons/react/outline/HomeIcon";
import InfoIcon from "@heroicons/react/outline/InformationCircleIcon";
import Image from "next/image";
import ActiveLink from "@components/ui/common/link";
import logo from "@public/static/images/logo-esdeveniments.webp";

const navigation = [
  { name: "Agenda", href: "/", current: true },
  { name: "Publicar", href: "/publica", current: false },
  { name: "Qui som", href: "/qui-som", current: false },
];

export default function Navbar() {
  const router = useRouter();

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
      className="w-full bg-whiteCorp sticky top-0 z-10"
    >
      {({ open }) => (
        <>
          <div className="sm:px-10 sm:w-[580px] md:w-[768px] lg:w-[1024px] bg-whiteCorp mx-auto py-2 h-14">
            <div className="h-full flex flex-col justify-center">
              {/* FirstBar - Logo&LaptopMenu&MenuIcon */}
              <div className="flex justify-around items-center">
                {/* Logo */}
                <div
                  className="flex w-full md:w-1/2 justify-start items-center py-2 px-3 cursor-pointer"
                  onClick={handleLogoClick}
                >
                  <Link href="/">
                    <Image
                      src={logo}
                      className="bg-whiteCorp flex justify-center items-center cursor-pointer"
                      alt="Logo Esdeveniments.cat"
                      width={169}
                      height={16}
                      priority
                    />
                  </Link>
                </div>
                {/* MenuIcon */}
                <div className="flex justify-center items-center md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center py-2 px-3 focus:outline-none">
                    {/* <span className="sr-only">Obrir menú principal</span> */}
                    {open ? (
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="h-5 w-5" aria-hidden="true" />
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
                        className="border-b-2 border-b-whiteCorp"
                      >
                        <a>{item.name}</a>
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              {/* SecondBar - Search&Share&MenuIcon */}
              <div className="fixed h-content bottom-0 left-0 right-0 py-2 bg-whiteCorp flex justify-evenly items-center gap-16 md:hidden">
                {/* Home */}
                <div
                  className="flex justify-center items-center rounded-xl cursor-pointer"
                  onClick={handleLogoClick}
                >
                  <ActiveLink href="/">
                    <button
                      type="button"
                      className="flex items-center p-2 border-b-whiteCorp focus:outline-none cursor-pointer rounded-xl"
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
                      className="flex items-center p-2 border-b-whiteCorp focus:outline-none cursor-pointer rounded-xl"
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
                      className="flex items-center p-2 border-b-whiteCorp focus:outline-none cursor-pointer rounded-xl"
                    >
                      <InfoIcon className="h-6 w-6" />
                    </button>
                  </ActiveLink>
                </div>
              </div>
            </div>
          </div>
          {/* MenuPanel (md:hidden) */}
          <Disclosure.Panel className="md:hidden">
            <div className="w-full relative flex justify-evenly items-center bg-whiteCorp transition-transform">
              {navigation.map((item) => (
                <ActiveLink
                  href={item.href}
                  key={item.name}
                  className="border-b-2 border-b-whiteCorp"
                >
                  <a>{item.name}</a>
                </ActiveLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
