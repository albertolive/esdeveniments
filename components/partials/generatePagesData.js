// import Link from "next/link";
import { siteUrl } from "@config/index";
import { monthsName } from "@utils/helpers";
import { addArticleToMonth, fixArticles } from "@utils/normalize";
import { getPlaceTypeAndLabel } from "@utils/helpers";

const month = monthsName[new Date().getMonth()];
const normalizedMonth = addArticleToMonth(month);

export function generatePagesData({ currentYear, place, byDate }) {
  const { type, label } = getPlaceTypeAndLabel(place);

  if (!place && !byDate) {
    return {
      title: `Descobreix el millor de Catalunya. Agenda ${currentYear}`,
      subTitle: `Viu aquest ${month} com mai amb les millors activitats de la temporada: mercats, exposicions, descobriments, passejades, concerts, museus, teatre... 
      No et quedis sense provar tots aquests plans imprescindibles per aprofitar-lo al màxim!`,
      metaTitle: `Descobreix el millor de Catalunya. Agenda ${currentYear}`,
      metaDescription: `Descobreix els millors esdeveniments de Catalunya: concerts, exposicions, mercats i més. Participa en l'agenda cultural i fes-la créixer!`,
      canonical: siteUrl,
      notFoundText: `Ho sentim, però no hi ha esdeveniments a Catalunya. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
    };
  }

  if (type === "region" && !byDate) {
    return {
      title: `El millor de ${label}. Agenda ${currentYear}`,
      subTitle: `${fixArticles(`Les millors coses per fer a ${label}: mercats, exposicions,
      descobriments, passejades, concerts, museus, teatre... Aquests són els
      millors plans per gaudir aquest ${month}!`)}`,
      metaTitle: `El millor de ${label}. Agenda ${currentYear}`,
      metaDescription: `Descobreix amb els millors actes culturals clau aquest ${month} a ${label}. Des de concerts fins a exposicions, la nostra agenda col·laborativa t'espera.`,
      canonical: `${siteUrl}/${place}`,
      notFoundText: `Ho sentim, però no hi ha esdeveniments a ${label}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
    };
  }

  if (type === "town" && !byDate) {
    return {
      metaTitle: `Descobreix ${label} aquest ${month} - Agenda ${currentYear}`,
      metaDescription: `Descobreix els esdeveniments imperdibles a ${label} en ${currentYear}. Concerts, exposicions, i més t'esperen. Suma't a la nostra agenda col·laborativa.`,
      title: `Agenda ${label} ${currentYear}`,
      subTitle: `Explora les millors activitats a ${label}: mercats, exposicions, passejades, concerts, i més. Viu intensament ${label} aquest ${month}.`,
      canonical: `${siteUrl}/${place}`,
      notFoundText: `Ho sentim, però no hi ha esdeveniments a ${label}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
    };
  }

  if (byDate && place) {
    if (byDate === "avui") {
      return {
        title: fixArticles(`Què fer ${byDate} a ${label}`),
        subTitle: `Aprofita el teu temps i troba el que necessites: el millor del dia al teu abast.`,
        metaTitle: fixArticles(`Què fer ${byDate} a ${label}`),
        metaDescription: fixArticles(
          `Què fer ${byDate} a ${label}. Us oferim tota la informació per gaudir ${label} i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar.`
        ),
        canonical: `${siteUrl}/${place}/${byDate}`,
        notFoundText: `Ho sentim, però no hi ha esdeveniments avui a ${label}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
      };
    } else if (byDate === "dema") {
      return {
        title: fixArticles(`Què fer demà a ${label}`),
        subTitle: `Aprofita el teu temps i troba el que necessites: el millor de demà al teu abast.`,
        metaTitle: fixArticles(`Què fer demà a ${label}`),
        metaDescription: fixArticles(
          `Què fer demà a ${label}. Us oferim tota la informació per gaudir ${label} i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar.`
        ),
        canonical: `${siteUrl}/${place}/${byDate}`,
        notFoundText: `Ho sentim, però no hi ha esdeveniments demà a ${label}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
      };
    } else if (byDate === "setmana") {
      return {
        title: fixArticles(`Coses per fer a ${label} aquesta ${byDate}`),
        subTitle: fixArticles(
          `Us proposem activitats d'oci i cultura a ${label} per a tots els gustos i butxaques.`
        ),
        metaTitle: fixArticles(`Què fer aquesta ${byDate} a ${label}`),
        metaDescription: fixArticles(
          `Què fer aquesta ${byDate} a ${label}. Teniu ganes de gaudir de aquesta setmana? Teatre, cinema, música, art i altres excuses per no parar de descobrir ${label}!`
        ),
        canonical: `${siteUrl}/${place}/${byDate}`,
        notFoundText: `Ho sentim, però no hi ha esdeveniments aquesta setmana a ${label}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
      };
    } else if (byDate === "cap-de-setmana") {
      return {
        title: fixArticles(`Què fer aquest cap de setmana a ${label}`),
        subTitle: fixArticles(
          `Les millors propostes per esprémer al màxim el cap de setmana a ${label}, de divendres a diumenge.`
        ),
        metaTitle: fixArticles(`Què fer aquest cap de setmana a ${label}`),
        metaDescription: fixArticles(
          `Què fer aquest cap de setmana a ${label}. Les millors propostes culturals per esprémer al màxim el cap de setmana, de divendres a diumenge.`
        ),
        canonical: `${siteUrl}/${place}/${byDate}`,
        notFoundText: `Ho sentim, però no hi ha esdeveniments aquest cap de setmana a ${label}. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
      };
    }
  }

  if (byDate) {
    if (byDate === "avui") {
      return {
        title: `Què fer ${byDate} a Catalunya`,
        subTitle: `Aprofita el teu temps i troba el que necessites: el millor del dia al teu abast.`,
        metaTitle: `Què fer ${byDate} a Catalunya`,
        metaDescription: `Què fer ${byDate} a Catalunya. Us oferim tota la informació per gaudir de Catalunya i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar. . Us oferim tota la informació per gaudir de Catalunya i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar.`,
        canonical: `${siteUrl}/${byDate}`,
        notFoundText: `Ho sentim, però no hi ha esdeveniments ${byDate} a Catalunya. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
      };
    } else if (byDate === "dema") {
      return {
        title: `Què fer demà a Catalunya`,
        subTitle: `Aprofita el teu temps i troba el que necessites: el millor del dia al teu abast.`,
        metaTitle: `Què fer demà a Catalunya`,
        metaDescription: `Què fer demà a Catalunya. Us oferim tota la informació per gaudir de Catalunya i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar. . Us oferim tota la informació per gaudir de Catalunya i de la seva enorme activitat cultural: cinema, museus, teatre, mercats, familiar.`,
        canonical: `${siteUrl}/${byDate}`,
        notFoundText: `Ho sentim, però no hi ha esdeveniments ${byDate} a Catalunya. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
      };
    } else if (byDate === "setmana") {
      return {
        title: `Coses per fer a Catalunya aquesta ${byDate}`,
        subTitle: `Us proposem activitats d'oci i cultura a Catalunya per a tots els gustos i butxaques.`,
        metaTitle: `Què fer aquesta ${byDate} a Catalunya`,
        metaDescription: `Què fer aquesta ${byDate} a Catalunya. Teniu ganes de gaudir de aquesta setmana? Teatre, cinema, música, art i altres excuses per no parar de descobrir Catalunya!`,
        canonical: `${siteUrl}/${byDate}`,
        notFoundText: `Ho sentim, però no hi ha esdeveniments aquesta ${byDate} a Catalunya. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
      };
    } else if (byDate === "cap-de-setmana") {
      return {
        title: `Què fer aquest cap de setmana a Catalunya`,
        subTitle: `Les millors propostes per esprémer al màxim el cap de setmana a Catalunya, de divendres a diumenge.`,
        metaTitle: `Què fer aquest cap de setmana a Catalunya`,
        metaDescription: `Què fer aquest cap de setmana a Catalunya. Les millors propostes culturals per esprémer al màxim el cap de setmana, de divendres a diumenge.`,
        canonical: `${siteUrl}/${byDate}`,
        notFoundText: `Ho sentim, però no hi ha esdeveniments aquest cap de setmana a Catalunya. Hem rebuscat en l'agenda i pot ser que també t'agradin aquestes altres opcions.`,
      };
    }
  }
}
