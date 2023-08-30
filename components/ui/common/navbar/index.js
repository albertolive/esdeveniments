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
        navbar.classList.add("shadow-xl", "shadow-neutral-100");
      } else {
        navbar.classList.remove("shadow-xl", "shadow-neutral-100");
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
                  <ActiveLink href="/" className="flex p-0 m-0 cursor-pointer" onClick={handleLogoClick}>
                    <Image
                      src={logo}
                      className="block cursor-pointer bg-whiteCorp py-2 px-4"
                      alt="Logo Esdeveniments.cat"
                      width={220}
                      height={18}
                      layout="fixed"
                      priority
                    />
                  </ActiveLink>
                </div>
                {/* MenuIcon */}
                <div className="flex items-center md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center py-2 px-4 rounded-full focus:outline-none">
                    {/* <span className="sr-only">Obrir menú principal</span> */}
                    {open ? (
                      <XIcon className="block h-7 w-7" aria-hidden="true" />
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
              <div className="fixed h-content bottom-0 left-0 right-0 bg-whiteCorp flex justify-center gap-x-32 pb-9 pt-10">
                
                {/* Share */}
                <div className="fixed bottom-4 right-32 flex justify-center items-center cursor-pointer">
                  <ActiveLink href="/publica">
                    <button
                      type="button"
                      className="relative inline-flex items-center px-2 py-2 rounded-full focus:outline-none cursor-pointer"
                    >
                      <PlusSmIcon
                        className="h-8 w-8"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:visible">Publica</span>
                    </button>
                  </ActiveLink>
                </div>
                {/* Search */}
                <div className="fixed bottom-4 left-32 flex justify-center items-center cursor-pointer">
                  <ActiveLink href="/cerca">
                    <button
                      type="button"
                      className="relative inline-flex items-center px-2 py-2 rounded-full focus:outline-none cursor-pointer"
                    >
                      <SearchIcon className="h-7 w-7" />
                    </button>
                  </ActiveLink>
                </div>
                
              </div>
            </div>
          </div>
          {/* MenuPanel (md:hidden) */}
          <Disclosure.Panel className="md:hidden">
            <div className="h-full flex justify-evenly items-center gap-8 px-4 pb-4 pt-3 border-t border-secondary bg-darkCorp">
              {navigation.map((item) => (
                <ActiveLink href={item.href} key={item.name}>
                  <a className="font-medium text-white hover:text-stone-200">
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
