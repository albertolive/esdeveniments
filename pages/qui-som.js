import Link from "next/link";
import Meta from "@components/partials/seo-meta";
import Image from "next/image";
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
        className="max-w-full h-full mx-0 px-0 flex flex-col gap-16 
        sm:px-0 sm:max-w-[576px]
        md:px-10 md:max-w-[768px] 
        lg:px-20 lg:max-w-[1024px]"
      >
        {/* <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div
            className="relative h-full text-lg max-w-prose mx-auto"
            aria-hidden="true"
          >
            <svg
              className="absolute top-12 left-full transform translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
              />
            </svg>
            <svg
              className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
              />
            </svg>
            <svg
              className="absolute bottom-12 left-full transform translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="d3eb07ae-5182-43e6-857d-35c643af9034"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
              />
            </svg>
          </div>
        </div> */}
        <div className="w-full flex flex-col gap-4">
          <div clas>
            <h1 className="text-center text-primary italic uppercase font-semibold">
              Qui som?
            </h1>
            <h2 className="text-center text-blackCorp italic uppercase font-medium">
              Esdeveniments
            </h2>
          </div>
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
              <a className="italic uppercase font-barlow font-semibold text-primary underline">aquí</a>
            </Link>{" "}
            pel seu compte.
          </p>
          <p className="">
            Podreu seguir l&apos;agenda cultural en aquesta pàgina web o seguir-nos a les xarxes socials:
          </p>
        </div>
      </div>
    </>
  );
}
