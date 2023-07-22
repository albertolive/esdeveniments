import { useEffect, useCallback, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useRouter } from "next/router";
import Link from "next/link";
import { useGetEvent } from "@components/hooks/useGetEvent";
import Meta from "@components/partials/seo-meta";
import { generateJsonData } from "@utils/helpers";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import XCircleIcon from "@heroicons/react/outline/XCircleIcon";

const AdArticle = dynamic(() => import("@components/ui/adArticle"), {
  loading: () => "",
  noSSR: false,
});

const Image = dynamic(() => import("@components/ui/common/image"), {
  loading: () => "",
});

const Modal = dynamic(() => import("@components/ui/common/modal"), {
  loading: () => "",
});

const NoEventFound = dynamic(
  () => import("@components/ui/common/noEventFound"),
  {
    loading: () => "",
  }
);

const Notification = dynamic(
  () => import("@components/ui/common/notification"),
  {
    loading: () => "",
  }
);

const Social = dynamic(() => import("@components/ui/common/social"), {
  loading: () => "",
});

const Weather = dynamic(() => import("@components/ui/weather"), {
  loading: () => "",
});

function replaceURLs(text) {
  if (!text) return;

  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    var hyperlink = url;
    if (!hyperlink.match("^https?://")) {
      hyperlink = "http://" + hyperlink;
    }
    return (
      '<a href="' +
      hyperlink +
      '" target="_blank" rel="noopener noreferrer">' +
      url +
      "</a>"
    );
  });
}

function isHTML(text) {
  if (!text) return;

  return text.match(/<[a-z][\s\S]*>/i);
}

function truncate(source, size, addDots = false) {
  return source.slice(0, size - 3) + (addDots ? "..." : "");
}

function generateMetaDescription(title, description) {
  const titleSanitized = title.replace(/(<([^>]+)>)/gi, "");
  let text = titleSanitized;

  if (text.length < 156) {
    const descriptionSanitized = description
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/"/gi, "")
      .replace(/^\s+|\s+$/g, "");

    text += ` - ${descriptionSanitized}`;
  }

  text = text.replace(/^(.{156}[^\s]*).*/, "$1");

  if (text.length > 156 - 3) {
    text = truncate(text, 156, true);
  }

  return text;
}

function generateMetaTitle(title, alternativeText, location) {
  const titleSanitized = title.replace(/(<([^>]+)>)/gi, "");
  let text = titleSanitized;

  text = text.replace(/^(.{60}[^\s]*).*/, "$1");

  if (text.length > 60) {
    text = truncate(text, 37);
    text = `${text} - ${alternativeText}`;
    text = truncate(text, 60);
  } else if (text.length !== 60) {
    text = truncate(text, 37);
    text = `${text} - ${alternativeText}`;

    if (text.length > 60) text = truncate(text, 60);
  }

  if (text.length < 60) {
    text = `${text} - ${location}`;
    text = truncate(text, 60);
  }

  text = text.replace(/^(.{53}[^\s]*).*/, "$1");

  return text;
}

const sendGoogleEvent = (event, obj) =>
  typeof window !== "undefined" &&
  window.gtag &&
  window.gtag("event", event, { ...obj });

export default function Event(props) {
  const mapRef = useRef(null);
  const { push, query, asPath } = useRouter();
  const { newEvent, edit_suggested = false } = query;
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteReasonModal, setOpenModalDeleteReasonModal] =
    useState(false);
  const [showThankYouBanner, setShowThankYouBanner] = useState(edit_suggested);
  const [reasonToDelete, setReasonToDelete] = useState(null);
  const { data, error } = useGetEvent(props);
  const slug = data.event ? data.event.slug : "";
  const title = data.event ? data.event.title : "";

  useEffect(() => {
    if (newEvent || edit_suggested) return;

    if (title !== "CANCELLED" && slug && asPath !== `/e/${slug}`)
      push(slug, undefined, { shallow: true });
  }, [asPath, data, edit_suggested, newEvent, push, slug, title]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const frame = document.createElement("iframe");
    frame.src = map.getAttribute("data-src");
    const onLoad = () => {
      // Remove the event listener to prevent memory leaks
      frame.removeEventListener("load", onLoad);
    };
    frame.addEventListener("load", onLoad);
    map.appendChild(frame);

    return () => {
      map.removeChild(frame);
    };
  }, [mapRef]);

  const onSendDeleteReason = async () => {
    const { id, title } = data.event;
    setOpenModalDeleteReasonModal(false);

    const rawResponse = await fetch(process.env.NEXT_PUBLIC_DELETE_EVENT, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, reason: reasonToDelete }),
    });

    const { success } = await rawResponse.json();

    if (success) setShowThankYouBanner(true);

    sendGoogleEvent("send-delete", {
      value: reasonToDelete,
    });
  };

  if (error) return <div>failed to load</div>;

  const {
    id,
    description,
    location,
    startDate,
    startTime,
    endTime,
    nameDay,
    formattedStart,
    formattedEnd,
    tag,
    imageUploaded,
    imageId,
    social,
    isEventFinished,
    eventImage,
  } = data.event;
  const descriptionHTML = isHTML(description)
    ? description
    : replaceURLs(description);

  const jsonData = generateJsonData({ ...data.event, imageUploaded });

  if (title === "CANCELLED") return <NoEventFound />;

  return (
    <>
      <Script
        id={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
      />
      <Meta
        title={generateMetaTitle(title, "Esdeveniments.cat", location)}
        description={generateMetaDescription(
          `${title} - ${nameDay} ${formattedStart} - ${location}`,
          description
        )}
        canonical={`https://www.esdeveniments.cat/${slug}`}
        imageUploaded={imageUploaded || eventImage}
        preload="/static/images/gMaps.webp"
      />
      {newEvent && <Notification title={title} url={slug} />}
      {showThankYouBanner && (
        <Notification
          customNotification={false}
          hideClose
          hideNotification={setShowThankYouBanner}
          title="Gràcies per contribuir a millorar el contingut de Esdeveniments.cat! En menys de 24 hores estarà disponible el canvi."
        />
      )}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" prefetch={false}>
              <a className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-yellow-400 dark:text-gray-400 dark:hover:text-white">
                <svg
                  className="mr-2 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Agenda
              </a>
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-400 md:ml-2 dark:text-gray-500">
                {title}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-4 md:px-0 lg:max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-y-16 gap-x-8">
            <div className="prose prose-lg max-w-none">
              {isEventFinished && (
                <div className="-mb-8 lg:-mb-4 mt-8">
                  <span className="font-bold text-black rounded-full p-2 px-4 bg-[#ECB84A] text-sm">
                    Esdeveniment finalitzat
                  </span>
                </div>
              )}
              <div className="border-b border-gray-200">
                <h2 className="font-bold text-[#ECB84A]">
                  {formattedEnd
                    ? `Del ${formattedStart} al ${formattedEnd}`
                    : `${nameDay}, ${formattedStart}`}
                </h2>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl break-words">
                  {title}
                </h1>
              </div>
              <div className="mt-6 space-y-10 min-h-[325px] lg:min-h-[100px] h-full">
                <AdArticle slot="1256471228" />
              </div>
              <dl className="mt-6 space-y-10">
                <div>
                  <div className="flex items-center">
                    <dt className="text-md font-bold text-gray-900">
                      Descripció
                    </dt>
                    <div className="ml-auto">
                      <button
                        onClick={() => {
                          setOpenModal(true);
                          sendGoogleEvent("open-change-modal");
                        }}
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-slate-200  text-xs font-medium rounded-full text-gray-800 bg-white hover:border-[#ECB84A] focus:outline-none"
                      >
                        <PencilIcon
                          className="-ml-1 mr-2 h-5 w-5 text-[#ECB84A] text-xs"
                          aria-hidden="true"
                        />
                        <span className="text-gray-800">
                          Suggerir un canvi
                        </span>
                      </button>
                    </div>
                  </div>
                  <Weather startDate={startDate} />
                  <div className="mt-3 xs:text-sm md:text-md lg:text-sm text-gray-500 break-words">
                    <div
                      dangerouslySetInnerHTML={{ __html: descriptionHTML }}
                    />
                  </div>
                </div>
              </dl>

              {imageUploaded && (
                <dl className="space-y-10">
                  <div className="sm:w-80 w-full">
                    <div className="rounded-lg bg-gray-100 overflow-hidden">
                      <a
                        href={imageUploaded}
                        className="pointer"
                        target="_blank"
                        rel="image_src noreferrer"
                      >
                        <Image
                          alt={location}
                          title={location}
                          height={250}
                          width={250}
                          image={imageUploaded}
                          className="w-full h-full object-center object-cover"
                        />
                      </a>
                    </div>
                  </div>
                </dl>
              )}

              <dl className="mt-6 space-y-10">
                <div>
                  <dt className="text-md font-bold text-gray-900">Hora</dt>
                  <dd className="mt-3 xs:text-sm md:text-md lg:text-sm text-gray-500">
                    {startTime} - {endTime}
                  </dd>
                </div>
              </dl>

              <dl className="mt-6 space-y-10">
                <div>
                  <dt className="text-md font-bold text-gray-900">Lloc</dt>
                  <dd className="mt-3 xs:text-sm md:text-md lg:text-sm text-gray-500">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${location}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {location}
                    </a>
                  </dd>
                </div>
              </dl>

              {tag && (
                <dl className="mt-6 space-y-10">
                  <div>
                    <dt className="text-md font-bold text-gray-900">Tags</dt>
                    <dd className="mt-3 text-sm text-gray-500">{tag}</dd>
                  </div>
                </dl>
              )}

              {social && (
                <dl className="mt-6">
                  <dt className="text-md font-bold text-gray-900">Enllaços</dt>
                  <Social links={social} />
                </dl>
              )}
              <div className="mt-6 space-y-10 min-h-[280px] lg:min-h-[100px] h-full">
                <AdArticle slot="8822317665" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
                <div
                  className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
                  data-src={`https://www.google.com/maps/embed/v1/place?q=${location}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
                  id="mymap"
                  ref={mapRef}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        title="Suggereix una edició"
      >
        <ul role="list" className="divide-y divide-gray-200 text-left">
          <li key="edit" className="py-4 flex">
            <Link href={`/${slug}/edita`} prefetch={false}>
              <a>
                <div className="flex items-center">
                  <PencilIcon
                    className="h-7 w-7 text-[#ECB84A] text-xs"
                    aria-hidden="true"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Canvia el títol o altres detalls
                    </p>
                    <p className="text-sm text-gray-500">
                      Edita el títol, la ubicació, l&apos;horari, etc.
                    </p>
                  </div>
                </div>
              </a>
            </Link>
          </li>
          <li key="remove" className="py-4 flex">
            <div
              className="cursor-pointer"
              as="button"
              onClick={() => {
                setOpenModal(false);
                setTimeout(() => setOpenModalDeleteReasonModal(true), 300);
                sendGoogleEvent("open-delete-modal");
              }}
            >
              <div className="flex items-center">
                <XCircleIcon
                  className="h-7 w-7 text-[#ECB84A] text-xs"
                  aria-hidden="true"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Eliminar</p>
                  <p className="text-sm text-gray-500">
                    L&apos;esdeveniment no existeix, està duplicat, etc.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </Modal>
      <Modal
        open={openDeleteReasonModal}
        setOpen={setOpenModalDeleteReasonModal}
        title="Suggereix una el·liminació"
      >
        <>
          <div className="text-sm font-medium text-gray-900">
            Motiu de l&apos;el·liminació suggerida
          </div>
          <fieldset className="space-y-5">
            <legend className="sr-only">Sol·licitud d&apos;eliminació</legend>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="not-exist"
                  checked={reasonToDelete === "not-exist"}
                  onChange={() => setReasonToDelete("not-exist")}
                  aria-describedby="not-exist-description"
                  name="not-exist"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="not-exist"
                  className="font-medium text-gray-700"
                >
                  No existeix
                </label>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="duplicated"
                  checked={reasonToDelete === "duplicated"}
                  onChange={() => setReasonToDelete("duplicated")}
                  aria-describedby="duplicated-description"
                  name="duplicated"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="duplicated"
                  className="font-medium text-gray-700"
                >
                  Duplicat
                </label>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="offensive"
                  checked={reasonToDelete === "offensive"}
                  onChange={() => setReasonToDelete("offensive")}
                  aria-describedby="offensive-description"
                  name="offensive"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="offensive"
                  className="font-medium text-gray-700"
                >
                  Ofensiu, nociu o enganyós
                </label>
              </div>
            </div>
            <div className="relative flex items-start text-left">
              <div className="flex items-center h-5">
                <input
                  id="others"
                  checked={reasonToDelete === "others"}
                  onChange={() => setReasonToDelete("others")}
                  aria-describedby="others-description"
                  name="others"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="others" className="font-medium text-gray-700">
                  Altres
                </label>
                <p id="offers-description" className="text-gray-500">
                  Envieu un correu amb el motiu a:{" "}
                  <a
                    className="hover:text-[#ECB84A]"
                    href="mailto:hola@esdeveniments.cat"
                  >
                    hola@esdeveniments.cat
                  </a>
                </p>
              </div>
            </div>
          </fieldset>
          <div className="flex mt-3 justify-end">
            <button
              disabled={!reasonToDelete}
              onClick={onSendDeleteReason}
              className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-[#ECB84A] ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
            >
              Enviar
            </button>
          </div>
        </>
      </Modal>
    </>
  );
}

export async function getStaticPaths() {
  const { getCalendarEvents } = require("@lib/helpers");
  const { twoWeeksDefault } = require("@lib/dates");

  const { from, until } = twoWeeksDefault();
  const { events } = await getCalendarEvents({
    from,
    until,
  });
  const eventsSlug = events
    .filter((event) => !event.isAd)
    .map((c) => ({ params: { eventId: c.slug } }));

  return {
    paths: eventsSlug,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { getCalendarEvent } = require("@lib/helpers");
  const eventId = params.eventId;

  const { event } = await getCalendarEvent(eventId);

  if (!event || !event.id) {
    return {
      notFound: true,
    };
  }

  return {
    props: { event },
    revalidate: 60,
  };
}
