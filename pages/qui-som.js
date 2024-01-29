import Link from "next/link";
import Meta from "@components/partials/seo-meta";
import { siteUrl } from "@config/index";
import Social from "components/ui/common/social";
import Image from "next/image";

export default function QuiSom() {
  const links = {
    web: "https://www.esdeveniments.cat",
    twitter: "https://twitter.com/esdeveniments_",
    instagram: "https://www.instagram.com/esdevenimentscat/",
    telegram: "https://t.me/esdeveniments",
    facebook: "https://www.facebook.com/esdeveniments.cat/",
  };

  return (
    <>
      <Meta
        title="Qui som - Esdeveniments.cat"
        description="Qui som? - Esdeveniments.cat és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a Catalunya."
        canonical={`${siteUrl}/qui-som`}
      />
      <div className="w-full h-screen flex flex-col justify-start items-center gap-10 px-4 pt-10 sm:px-10 sm:w-[580px]">
        <div>
          <h1 className="text-center italic uppercase font-medium">Qui som?</h1>
          <h3 className="text-center italic font-normal text-primary">
            esdeveniments.cat
          </h3>
        </div>
        <div className="w-full flex flex-col justify-center gap-4">
          <div className="flex flex-wrap justify-between">
            <div class="max-w-2xl mx-auto bg-white p-5 rounded shadow w-full sm:w-1/2">
              <Image
                class="w-32 h-32 rounded-full mx-auto"
                src="https://media.licdn.com/dms/image/C4D03AQETSNS8Sficgg/profile-displayphoto-shrink_200_200/0/1610292527836?e=1711584000&v=beta&t=ymqnTnXEVV9aiQDGLmHR3TW-XvNVhrk44K1tRw0jEDk"
                alt="Albert Olivé"
                width={128}
                height={128}
              />
              <h2 class="text-2xl text-center mt-4 font-semibold">
                Albert Olivé Corbella
              </h2>
              <p class="text-center text-gray-500 mb-5">Fundador</p>
              <a
                href="https://www.linkedin.com/in/albertolivecorbella/"
                class="block w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                LinkedIn
              </a>
            </div>
            <div class="max-w-2xl mx-auto bg-white p-5 rounded shadow w-full sm:w-1/2">
              <Image
                class="w-32 h-32 rounded-full mx-auto"
                src="https://media.licdn.com/dms/image/D4D03AQGHRf-STQur6g/profile-displayphoto-shrink_200_200/0/1702401973666?e=1711584000&v=beta&t=8A0NGvY7w1iOpeLtKd5cA9klHJZJ0xTdBboVYavIIR4"
                alt="Andreu Benitez Moreno"
                width={128}
                height={128}
              />
              <h2 class="text-2xl text-center mt-4 font-semibold">
                Andreu Benitez Moreno
              </h2>
              <p class="text-center text-gray-500 mb-5">Co-Fundador</p>
              <a
                href="https://www.linkedin.com/in/andreubenitezmoreno/"
                class="block w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                LinkedIn
              </a>
            </div>
            <div className="flex mt-4">
              <p className="text-center">
                Esdeveniments.cat és una iniciativa ciutadana per veure de
                manera fàcil i ràpida tots els actes culturals que es fan a
                Catalunya.
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
        </div>
      </div>
    </>
  );
}
