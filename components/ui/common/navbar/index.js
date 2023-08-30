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
          <div className="mx-auto p-0 pt-5">
            <div className="flex-col justify-center h-full">
              {/* FirstBar - Logo&LaptopMenu */}
              <div className="flex justify-around items-center p-5">
                {/* Logo */}
                <div className="w-full md:w-1/2 flex justify-center items-center">
                  <Link href="/">
                    <a
                      className="flex p-0 m-0 cursor-pointer"
                      onClick={handleLogoClick}
                    >
                      <Image
                        src={logo}
                        className="block cursor-pointer bg-whiteCorp"
                        alt="Logo Esdeveniments.cat"
                        width={280}
                        height={24}
                        layout="fixed"
                        priority
                      />
                    </a>
                  </Link>
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
              <div className="flex justify-center gap-x-12 p-5">
                {/* MenuIcon */}
                <div className="flex items-center md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center py-2 px-4 rounded-full focus:outline-none">
                    {/* <span className="sr-only">Obrir menú principal</span> */}
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                {/* Search */}
                <div>
                  <ActiveLink href="/cerca">
                    <button
                      type="button"
                      className="relative inline-flex items-center px-2 py-2 rounded-full focus:outline-none cursor-pointer"
                    >
                      <SearchIcon className="h-6 w-6" />
                    </button>
                  </ActiveLink>
                </div>
                {/* Share */}
                <div className="flex justify-center items-center cursor-pointer">
                  <ActiveLink href="/publica">
                    <button
                      type="button"
                      className="relative inline-flex items-center px-2 py-2 rounded-full focus:outline-none cursor-pointer"
                    >
                      <PlusSmIcon className="h-6 w-6" aria-hidden="true" />
                      <span className="hidden sm:visible">Publica</span>
                    </button>
                  </ActiveLink>
                </div>
              </div>
            </div>
          </div>
          {/* MenuPanel (md:hidden) */}
          <Disclosure.Panel className="md:hidden">
            <div className="h-full flex justify-evenly items-center gap-8 px-4 pb-8 pt-7 border-t border-secondary">
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
