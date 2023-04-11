import { Disclosure } from "@headlessui/react";
import MenuIcon from "@heroicons/react/outline/MenuIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import PlusSmIcon from "@heroicons/react/solid/PlusSmIcon";
import SearchIcon from "@heroicons/react/solid/SearchIcon";
import Image from "next/image";
import ActiveLink from "@components/ui/common/link";
import logo from "@public/static/images/logo-cultura-cardedeu.png";

const navigation = [
  { name: "Agenda", href: "/", current: true },
  { name: "Qui som", href: "/qui-som", current: false },
  { name: "Arxiu", href: "/sitemaps", current: false },
];

export default function Example() {
  return (
    <Disclosure as="nav" className="bg-gray-800 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-6">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                    <span className="sr-only">Obrir menú principal</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex items-center">
                  <ActiveLink href="/">
                    <a className="flex">
                      <Image
                        src={logo}
                        className="block h-8 cursor-pointer"
                        alt="Logo Cultura Cardedeu"
                        width={120}
                        height={60}
                        layout="fixed"
                        priority
                      />
                    </a>
                  </ActiveLink>
                </div>
              </div>

              <div className="flex items-center">
                <div className="hidden md:flex md:items-center">
                  {navigation.map((item) => (
                    <ActiveLink href={item.href} key={item.name}>
                      <a className="font-medium mr-4 text-white hover:text-stone-200">
                        {item.name}
                      </a>
                    </ActiveLink>
                  ))}
                </div>
                <div className="flex-shrink-0 cursor-pointer">
                  <ActiveLink href="/cerca">
                    <SearchIcon className="-ml-1 mr-6 h-6 w-6 text-white" />
                  </ActiveLink>
                </div>
                <div className="flex-shrink-0">
                  <ActiveLink href="/publica">
                    <button
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none"
                    >
                      <PlusSmIcon
                        className="-ml-1 mr-2 h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                      <span className="text-white">Publica</span>
                    </button>
                  </ActiveLink>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <ActiveLink href={item.href} key={item.name}>
                  <a className="font-medium mr-4 text-white hover:text-stone-200">
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
