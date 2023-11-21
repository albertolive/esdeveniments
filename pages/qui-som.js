import Link from "next/link";
import Meta from "@components/partials/seo-meta";
import { siteUrl } from "@config/index";

export default function QuiSom() {
  return <>
    <Meta
      title="Qui som - Esdeveniments.cat"
      description="Qui som? - Esdeveniments.cat és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Catalunya."
      canonical={`${siteUrl}/qui-som`}
    />
    <div
      className="w-full px-4 flex flex-col gap-8 justify-center items-center
      sm:px-0 sm:max-w-[576px]
      md:px-10 md:max-w-[768px] 
      lg:px-20 lg:max-w-[1024px]"
    >
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-center text-primary italic uppercase font-semibold">
            Qui som?
          </h1>
          <h2 className="text-center tracking-tight text-blackCorp italic uppercase font-medium">
            Esdeveniments.cat
          </h2>
        </div>
      </div>
      <div
        className="w-full h-[40vh] flex flex-col justify-start gap-4
      xs:h-[45vh] xs:w-2/3
      md:h-[60vh]
      "
      >
        <p className="text-center">
          Esdeveniments.cat és una iniciativa ciutadana per veure de manera
          fàcil i ràpida tots els actes culturals que es fan a Catalunya.
        </p>
        <p className="text-center">
          L&apos;agenda és col·laborativa, i cada persona que organitzi un
          acte cultural podrà publicar-lo{" "}
          <Link
            href="/publica"
            prefetch={false}
            className="italic uppercase font-barlow font-semibold text-primary underline">
            
              aquí
            
          </Link>{" "}
          pel seu compte.
        </p>
        <p className="text-center">
          Podreu seguir l&apos;agenda cultural en aquesta pàgina web o
          seguir-nos a les xarxes socials:
        </p>
      </div>
    </div>
  </>;
}
