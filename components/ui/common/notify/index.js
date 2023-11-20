import InformationCircleIcon from "@heroicons/react/solid/InformationCircleIcon";
import Link from "next/link";
import { useRouter } from "next/router";

const sendGA = () => {
  if (typeof window !== "undefined") {
    window.gtag && window.gtag("event", "2022-en-xifres");
  }
};

export default function Notify() {
  const { pathname } = useRouter();

  if (pathname === "/2022-en-xifres") return null;

  return (
    <div className="relative  break-word py-1">
      <div className="flex justify-center items-center mb-1">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-[#ECB84A]"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-md font-medium ">
            A Cardedeu sempre diem que som un poble ple de cultura. És realment
            així? Descobreix-ho a:{" "}
            <span className="text-md ">
              <Link
                href={"/2022-en-xifres"}
                prefetch={false}
                className="text-md font-bold text-[#ECB84A] hover:underline"
                onClick={sendGA}>
                
                  2022 en xifres
                
              </Link>
            </span>
          </h3>
        </div>
      </div>
      <div className="flex-grow border-t border-slate-200"></div>
    </div>
  );
}
