import Link from "next/link";
import Meta from "@components/partials/seo-meta";
import { siteUrl } from "@config/index";

export default function QuiSom() {
  return (
    <>
      <Meta
        title="Qui som - Esdeveniments.cat"
        description="Qui som? - Esdeveniments.cat és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Catalunya."
        canonical={`${siteUrl}/qui-som`}
      />
      <div
        className="max-w-full h-full mx-0 px-4 flex flex-col gap-16 
        sm:px-0 sm:max-w-[576px]
        md:px-10 md:max-w-[768px] 
        lg:px-20 lg:max-w-[1024px]"
      >
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-center text-primary italic uppercase font-semibold">
            Qui som?
          </h1>
          <h2 className="text-center text-blackCorp italic uppercase font-medium">
            Esdeveniments
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <p className="">
            Esdeveniments.cat és una iniciativa ciutadana per veure en un cop
            d&apos;ull tots els actes culturals que es fan a tot arreu.
          </p>
          <p>
            L&apos;agenda és col·laborativa, i cada persona que organitzi un
            acte cultural podrà publicar-lo{" "}
            <Link href="/publica" prefetch={false}>
              <a className="italic uppercase font-barlow font-semibold text-primary underline">
                aquí
              </a>
            </Link>{" "}
            pel seu compte.
          </p>
          <p className="">
            Podreu seguir l&apos;agenda cultural en aquesta pàgina web o
            seguir-nos a les xarxes socials:
          </p>
        </div>
      </div>
    </>
  );
}
