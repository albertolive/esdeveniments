import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import MenuIcon from "@heroicons/react/outline/MenuIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import PlusSmIcon from "@heroicons/react/solid/PlusSmIcon";
import SearchIcon from "@heroicons/react/solid/SearchIcon";
import Image from "next/image";
import ActiveLink from "@components/ui/common/link";
import logo from "@public/static/images/logo-esdeveniments-fonsclar.png";
import { useRouter } from "next/router";

const navigation = [
  { name: "Agenda", href: "/", current: true },
  { name: "Qui som", href: "/qui-som", current: false },
  // { name: "Arxiu", href: "/sitemap", current: false },
];

if (typeof window !== "undefined") {
  // Esperamos a que el DOM esté completamente cargado
  window.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");

    function handleScroll() {
      if (window.scrollY > 0) {
        navbar.classList.add("shadow", "shadow-neutral-100");
      } else {
        navbar.classList.remove("shadow", "shadow-neutral-100");
      }
    }

    // Escuchamos el evento de scroll
    window.addEventListener("scroll", handleScroll);

    // Ejecutamos la función al cargar la página
    handleScroll();
  });
}

export default function Navbar() {
  const router = useRouter();

  const navigateToMainPage = () => {
    localStorage.removeItem("place");
    localStorage.removeItem("byDate");
    localStorage.removeItem("currentPage");
    localStorage.removeItem("searchTerm");

    router.push("/");
  };

  const reloadPage = () => {
    // Delay the page reload after navigation is complete
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleLogoClick = () => {
    navigateToMainPage();
    reloadPage();
  };

  return (
    <Disclosure as="nav" className="navbar bg-whiteCorp sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto py-2">
            <div className="flex flex-col justify-center h-full">
              {/* FirstBar - Logo&LaptopMenu&MenuIcon */}
              <div className="flex justify-around items-center p-3">
                {/* Logo */}
                <div className="w-full md:w-1/2 flex justify-start items-center py-2 px-4">
                  <a href="/" className="flex p-0 m-0 cursor-pointer" onClick={handleLogoClick}>
                    <Image
                      src={logo}
                      className="block cursor-pointer bg-whiteCorp py-2 px-4"
                      alt="Logo Esdeveniments.cat"
                      width={220}
                      height={18}
                      layout="fixed"
                      priority
                    />
                  </a>
                </div>
                {/* MenuIcon */}
                <div className="flex items-center md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center py-2 px-4 rounded-full focus:outline-none">
                    {/* <span className="sr-only">Obrir menú principal</span> */}
                    {open ? (
                      <XIcon className="block h-7 w-7 text-primary" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-7 w-7" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                {/* LaptopMenu */}
                <div className="md:w-1/2 flex justify-around items-center gap-x-6">
                  <div className="hidden md:flex md:items-center">
                    {navigation.map((item) => (
                      <ActiveLink
                        href={item.href}
                        key={item.name}
                        className="relative inline-flex items-center px-2 py-2 rounded-full focus:outline-none cursor-pointer"
                      >
                        <a className="font-medium mx-2">{item.name}</a>
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              {/* SecondBar - Search&Share&MenuIcon */}
              <div className="fixed h-[84px] bottom-0 left-0 right-0 bg-whiteCorp border-t border-darkCorp flex justify-center items-center gap-x-36">
                    
                {/* Search */}
                <div className="flex justify-center items-center rounded-xlcursor-pointer">
                  <ActiveLink href="/cerca">
                    <button
                      type="button"
                      className="flex items-center p-3 focus:outline-none cursor-pointer rounded-xl border-2 border-darkCorp"
                    >
                      <SearchIcon className="h-7 w-7" />
                    </button>
                  </ActiveLink>
                </div>

                {/* Share */}
                <div className="flex justify-center items-center rounded-xl cursor-pointer">
                  <ActiveLink href="/publica">
                    <button
                      type="button"
                      className="flex items-center p-3 focus:outline-none cursor-pointer rounded-xl border-2 border-darkCorp"
                    >
                      <PlusSmIcon
                        className="h-8 w-8"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:visible">Publica</span>
                    </button>
                  </ActiveLink>
                </div>

              </div>
            </div>
          </div>
          {/* MenuPanel (md:hidden) */}
          <Disclosure.Panel className="md:hidden">
            <div className="h-[75px] flex justify-evenly items-center gap-8 px-4 pb-6 pt-6 bg-whiteCorp border-t border-darkCorp">
              {navigation.map((item) => (
                <ActiveLink href={item.href} key={item.name}>
                  <a className="text-base font-semibold px-8">
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
