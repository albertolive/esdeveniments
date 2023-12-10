import Link from "next/link";
import Meta from "@components/partials/seo-meta";
import { siteUrl } from "@config/index";
import Social from "components/ui/common/social";

export default function QuiSom() {
  const links = {
    web: "https://www.esdeveniments.cat",
    twitter: "https://twitter.com/esdeveniments_",
    instagram: "https://www.instagram.com/esdevenimentscat/",
    telegram: "https://t.me/esdeveniments",
    facebook: "https://www.facebook.com/esdeveniments.cat/",
  };

  return <>
    <Meta
      title="Qui som - Esdeveniments.cat"
      description="Qui som? - Esdeveniments.cat és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Catalunya."
      canonical={`${siteUrl}/qui-som`}
    />
    <div className="w-full h-screen flex flex-col justify-start items-center gap-10 px-4 pt-10 sm:px-10 sm:w-[580px]">
      <div>
        <h1 className="text-center italic uppercase font-medium">
          Qui som?
        </h1>
        <h3 className="text-center italic font-normal text-primary">
          esdeveniments.cat
        </h3>
      </div>
      <div
        className="w-full flex flex-col justify-center gap-4">
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
            className="font-normal text-primary hover:underline"
          >
            aquí
          </Link>{" "}
          pel seu compte.
        </p>
        <p className="text-center">
          Podreu seguir l&apos;agenda cultural en aquesta pàgina web o
          seguir-nos a les xarxes socials:
        </p>
        <Social links={links} />
      </div>
    </div>
  </>;
}
