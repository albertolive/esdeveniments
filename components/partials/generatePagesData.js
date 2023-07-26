import { monthsName } from "@utils/helpers";
import { addArticleToMonth, fixArticles } from "@utils/normalize";
import { getPlaceTypeAndLabel } from "@utils/helpers";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
const month = monthsName[new Date().getMonth()];
const normalizedMonth = addArticleToMonth(month);

export function generatePagesData({ currentYear, place, byDate }) {
  const { type, label } = getPlaceTypeAndLabel(place);

  if (!place && !byDate) {
    return {
      title: `Agenda ${currentYear}`,
      subTitle: `Viu aquest ${month} com mai amb les millors activitats de la temporada: mercats, exposicions, descobriments, passejades, concerts, museus, teatre... 
     No et quedis sense provar tots aquests plans imprescindibles per aprofitar-lo al màxim!`,
      description:
        "Vols viure experiències úniques i emocionants? La cultura és el lloc on cal estar! Us oferim una gran varietat d'opcions perquè mai us avorriu i sempre tingueu alguna cosa interessant per fer. Descobriu tot el que passa a Catalunya i voltants, i deixeu-vos sorprendre per la seva riquesa cultural.",
      metaTitle: `Agenda ${currentYear} - Esdeveniments.cat`,
      metaDescription: `Esdeveniments.cat és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a. L'agenda és col·laborativa.`,
      canonical: siteUrl,
      notFoundText: `Ho sentim, però no hi ha esdeveniments a Catalunya. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
    };
  }

  if (type === "region" && !byDate) {
    return {
      metaTitle: `Agenda ${label} ${currentYear} - Esdeveniments.cat`,
      metaDescription: `Esdeveniments.cat és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a ${label}. L'agenda és col·laborativa.`,
      title: `Agenda ${label} ${currentYear}`,
      subTitle: `${fixArticles(`Les millors coses per fer ${label}: mercats, exposicions,
      descobriments, passejades, concerts, museus, teatre... Aquests són els
      millors plans per gaudir aquest ${month}!`)}`,
      description: `${fixArticles(`Voleu viure experiències úniques i emocionants? La cultura ${label} és el lloc on cal estar! Us oferim una gran varietat d'opcions perquè mai us avorriu i sempre tingueu
      alguna cosa interessant per fer. Descobriu tot el que passa ${label} i voltants, i deixeu-vos sorprendre per la seva riquesa cultural.`)}`,
      canonical: `${siteUrl}/${place}`,
      notFoundText: `Ho sentim, però no hi ha esdeveniments a ${label}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
    };
  }

  if (type === "town" && !byDate) {
    const descriptionRegionTown = (
      <>
        Us donem un ventall de possibilitats perquè no us quedi temps per
        avorrir-vos. La cultura no descansa. Podeu veure què passa{" "}
        <Link href={`/${place}/avui`} prefetch={false}>
          <a className="font-medium text-black underline">avui</a>
        </Link>
        ,{" "}
        <Link href={`/${place}/setmana`} prefetch={false}>
          <a className="font-medium text-black underline">aquesta setmana</a>
        </Link>
        , o ve,{" "}
        <Link href={`/${place}/cap-de-setmana`} prefetch={false}>
          <a className="font-medium text-black underline">el cap de setmana</a>
        </Link>{" "}
        a {label}. Ja no teniu cap excusa, per no estar al dia, de tot el que
        passa a {label} vinculat a la cultura!
      </>
    );

    return {
      metaTitle: `Agenda ${label} ${currentYear} - Esdeveniments.cat`,
      metaDescription: `Esdeveniments.cat és una iniciativa ciutadana per veure en un cop d'ull tots els actes culturals que es fan a ${label}. L'agenda és col·laborativa.`,
      title: `Agenda ${label} ${currentYear}`,
      subTitle: `Les millors coses per fer a ${label}: mercats, exposicions, descobriments, passejades, concerts, museus, teatre... Aquests són els
      millors plans per gaudir de ${label} ${normalizedMonth}!`,
      description: descriptionRegionTown,
      canonical: `${siteUrl}/${place}`,
      notFoundText: `Ho sentim, però no hi ha esdeveniments a ${label}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
    };
  }

  if (byDate && place) {
    const extraProps = {
      canonocal: `${siteUrl}/${place}/${byDate}`,
      notFoundText: `Ho sentim, però no hi ha esdeveniments ${byDate} a ${label}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
    };
    if (byDate === "avui") {
      return {
        title: fixArticles(`Què fer ${byDate} ${label}`),
        subTitle: `Aprofita el teu temps i troba el que necessites: el millor del dia al teu abast.`,
        description: (
          <>
            Les coses per fer {fixArticles(label)} no descansen ni un dia.{" "}
            <Link href={`/${place}/setmana`} prefetch={false}>
              <a className="font-medium text-black underline">Cada setmana</a>
            </Link>
            , descobrireu centenars d&apos;activitats increïbles per tots els
            racons. Perquè us sigui més fàcil la tria, us ajudem a trobar el pla
            ideal per a vosaltres: cinema alternatiu, l&apos;exposició
            imperdible, l&apos;obra de teatre de la qual tothom parla, mercats,
            activitats familiars... Us oferim tota la informació per gaudir de{" "}
            {label} i de la seva enorme activitat cultural. No cal moderació, la
            podeu gaudir a l&apos;engròs.
          </>
        ),
        metaTitle: fixArticles(`Què fer ${byDate} ${label}`),
        metaDescription: fixArticles(
          `Què fer ${byDate} ${label}. Us oferim tota la informació per gaudir ${label} i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar.`
        ),
        ...extraProps,
      };
    } else if (byDate === "setmana") {
      return {
        title: fixArticles(`Coses per fer ${label} aquesta ${byDate}`),
        subTitle: fixArticles(
          `Us proposem activitats d'oci i cultura ${label} per a tots els gustos i butxaques.`
        ),
        description:
          fixArticles(`Teniu ganes de gaudir de aquesta setmana? Esteu en el lloc correcte! Us hem fet
        una selecció dels plans d'aquesta setmana que engloben el millor de
        tots els àmbits i per a tots els públics. Teatre, cinema, música, art i
        altres excuses per no parar de descobrir ${label}!`),
        metaTitle: fixArticles(`Què fer aquesta ${byDate} ${label}`),
        metaDescription: fixArticles(
          `Què fer aquesta ${byDate} ${label}. Teniu ganes de gaudir de aquesta setmana? Teatre, cinema, música, art i altres excuses per no parar de descobrir ${label}!`
        ),
        ...extraProps,
      };
    } else if (byDate === "cap-de-setmana") {
      return {
        title: fixArticles(`Què fer aquest cap de setmana ${label}`),
        subTitle: fixArticles(
          `Les millors propostes per esprémer al màxim el cap de setmana ${label}, de divendres a diumenge.`
        ),
        description:
          fixArticles(`Hem bussejat en l'agenda cultural ${label} i us portem una tria
        del milloret que podreu fer aquest cap de setmana. Art, cinema,
        teatre... No teniu excusa, us espera un cap de setmana increïble sense
        moure-us ${label}.`),
        metaTitle: fixArticles(`Què fer aquest cap de setmana ${label}`),
        metaDescription: fixArticles(
          `Què fer aquest cap de setmana ${label}. Les millors propostes culturals per esprémer al màxim el cap de setmana, de divendres a diumenge.`
        ),
        ...extraProps,
      };
    }
  }

  if (byDate) {
    const extraProps = {
      canonocal: `${siteUrl}/${byDate}`,
      notFoundText: `Ho sentim, però no hi ha esdeveniments ${byDate} Catalunya. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
    };
    if (byDate === "avui") {
      return {
        title: `Què fer ${byDate} a Catalunya`,
        subTitle: `Aprofita el teu temps i troba el que necessites: el millor del dia al teu abast.`,
        description: (
          <>
            Les coses per fer a Catalunya no descansen ni un dia.{" "}
            <Link href={`/setmana`} prefetch={false}>
              <a className="font-medium text-black underline">Cada setmana</a>
            </Link>
            , descobrireu centenars d&apos;activitats increïbles per tots els
            racons. Perquè us sigui més fàcil la tria, us ajudem a trobar el pla
            ideal per a vosaltres: cinema alternatiu, l&apos;exposició
            imperdible, l&apos;obra de teatre de la qual tothom parla, mercats,
            activitats familiars... Us oferim tota la informació per gaudir de{" "}
            {label} i de la seva enorme activitat cultural. No cal moderació, la
            podeu gaudir a l&apos;engròs.
          </>
        ),
        metaTitle: `Què fer ${byDate} a Catalunya`,
        metaDescription: `Què fer ${byDate} a Catalunya. Us oferim tota la informació per gaudir de Catalunya i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar. . Us oferim tota la informació per gaudir de Catalunya i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar.`,
        ...extraProps,
      };
    } else if (byDate === "setmana") {
      return {
        title: `Coses per fer a Catalunya aquesta ${byDate}`,
        subTitle: `Us proposem activitats d'oci i cultura a Catalunya per a tots els gustos i butxaques.`,
        description: `Teniu ganes de gaudir de aquesta setmana? Esteu en el lloc correcte! Us hem fet
        una selecció dels plans d'aquesta setmana que engloben el millor de
        tots els àmbits i per a tots els públics. Teatre, cinema, música, art i
        altres excuses per no parar de descobrir Catalunya!`,
        metaTitle: `Què fer aquesta ${byDate} a Catalunya`,
        metaDescription: `Què fer aquesta ${byDate} a Catalunya. Teniu ganes de gaudir de aquesta setmana? Teatre, cinema, música, art i altres excuses per no parar de descobrir Catalunya!`,
        ...extraProps,
      };
    } else if (byDate === "cap-de-setmana") {
      return {
        title: `Què fer aquest cap de setmana a Catalunya`,
        subTitle: `Les millors propostes per esprémer al màxim el cap de setmana a Catalunya, de divendres a diumenge.`,
        description: `Hem bussejat en l'agenda cultural de Catalunya i us portem una tria
        del milloret que podreu fer aquest cap de setmana. Art, cinema,
        teatre... No teniu excusa, us espera un cap de setmana increïble sense
        moure-us de Catalunya.`,
        metaTitle: `Què fer aquest cap de setmana a Catalunya`,
        metaDescription: `Què fer aquest cap de setmana a Catalunya. Les millors propostes culturals per esprémer al màxim el cap de setmana, de divendres a diumenge.`,
        ...extraProps,
      };
    }
  }
}
