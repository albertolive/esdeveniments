import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useRouter } from "next/router";
import Link from "next/link";
import { useGetEvent } from "@components/hooks/useGetEvent";
import Meta from "@components/partials/seo-meta";
import { generateJsonData } from "@utils/helpers";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import ArrowDownIcon from "@heroicons/react/outline/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/outline/ArrowUpIcon";
import { siteUrl } from "@config/index";

const AdArticle = dynamic(() => import("@components/ui/adArticle"), {
  loading: () => "",
  noSSR: false,
});

const Image = dynamic(() => import("@components/ui/common/image"), {
  loading: () => "",
});

const EditModal = dynamic(() => import("@components/ui/editModal"), {
  loading: () => "",
});

const Maps = dynamic(() => import("@components/ui/maps"), {
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
  const { push, query, asPath } = useRouter();
  const { newEvent, edit_suggested = false } = query;
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteReasonModal, setOpenModalDeleteReasonModal] =
    useState(false);
  const [showThankYouBanner, setShowThankYouBanner] = useState(edit_suggested);
  const [reasonToDelete, setReasonToDelete] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const { data, error } = useGetEvent(props);
  const slug = data.event ? data.event.slug : "";
  const title = data.event ? data.event.title : "";

  useEffect(() => {
    if (newEvent || edit_suggested) return;

    if (title !== "CANCELLED" && slug && asPath !== `/e/${slug}`)
      push(slug, undefined, { shallow: true });
  }, [asPath, data, edit_suggested, newEvent, push, slug, title]);

  const onSendDeleteReason = async () => {
    const { id, title } = data.event;
    setOpenModalDeleteReasonModal(false);

    const rawResponse = await fetch(process.env.NEXT_PUBLIC_DELETE_EVENT, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title,
        reason: reasonToDelete,
        isProduction: process.env.NODE_ENV === "production",
      }),
    });

    const { success } = await rawResponse.json();

    if (success) setShowThankYouBanner(true);

    sendGoogleEvent("send-delete", {
      value: reasonToDelete,
    });
  };

  const onRemove = () => {
    setOpenModal(false);
    setTimeout(() => setOpenModalDeleteReasonModal(true), 300);
    sendGoogleEvent("open-delete-modal");
  };

  const handleShowMap = () => {
    setShowMap(!showMap);
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
        canonical={`${siteUrl}/e/${slug}`}
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
      {/* <nav className="flex" aria-label="Breadcrumb">
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
      </nav> */}
      {/* General */}
      <div className="bg-whiteCorp">
        <div
          className="w-full px-4 flex flex-col gap-4 justify-center items-center
        sm:px-0 sm:max-w-[576px]
        md:px-10 md:max-w-[768px] 
        lg:px-20 lg:max-w-[1024px]"
        >
          <div className="flex flex-col gap-4">
            <h1 className="font-bold break-words uppercase">{title}</h1>
            <h2 className="font-medium">
              {formattedEnd
                ? `Del ${formattedStart} al ${formattedEnd}`
                : `${nameDay}, ${formattedStart}`}
            </h2>
            <Weather startDate={startDate} />
          </div>
          {isEventFinished && (
            <div className="w-full">
              <p className="font-medium text-primary">
                Aquest esdeveniment ha finalitzat
              </p>
            </div>
          )}
          <div
            className="mt-6 space-y-10 min-h-[325px] h-full
          lg:min-h-[100px]"
          >
            <AdArticle slot="1510301521" />
          </div>
          {imageUploaded && (
            <div className="w-full">
              <a
                href={imageUploaded}
                className="pointer"
                target="_blank"
                rel="image_src noreferrer"
              >
                <Image
                  alt={location}
                  title={location}
                  height="100%"
                  width="100%"
                  image={imageUploaded}
                  className="w-full h-full object-center object-cover"
                />
              </a>
            </div>
          )}
            <div>
              <div className="flex flex-col justify-center items-center">
                <dt className="">Descripció</dt>
              </div>
              <div className="p-4 text-center break-words">
                <div dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
              </div>
            </div>
          <div className="p-4">
            <button
              onClick={() => {
                setOpenModal(true);
                sendGoogleEvent("open-change-modal");
              }}
              type="button"
              className="flex justify-center items-center gap-2 text-whiteCorp bg-primary rounded-xl py-3 px-6 ease-in-out duration-300 border border-whiteCorp font-barlow italic uppercase font-semibold tracking-wide focus:outline-none">
              <PencilIcon className="w-5 h-5" aria-hidden="true" />
              <p
                className="font-barlow hidden
                    sm:block
                    "
              >
                Editar
              </p>
            </button>
          </div>

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
          <div
            className="flex items-center text-sm text-gray-500 cursor-pointer mt-2"
            onClick={handleShowMap}
          >
            <p className="whitespace-nowrap">
              {showMap ? "Ocultar mapa" : "Mostrar mapa"}
            </p>
            {showMap ? (
              <ArrowUpIcon
                className="ml-1 h-5 w-5 text-[#ECB84A] text-xs"
                aria-hidden="true"
              />
            ) : (
              <ArrowDownIcon
                className="ml-1 h-5 w-5 text-[#ECB84A] text-xs"
                aria-hidden="true"
              />
            )}
          </div>

          {showMap && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
                <Maps location={location} />
              </div>
            </div>
          )}

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
            <AdArticle slot="9643657007" />
          </div>
        </div>
      </div>
      {openModal || openDeleteReasonModal ? (
        <EditModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          slug={slug}
          setOpenModalDeleteReasonModal={setOpenModalDeleteReasonModal}
          sendGoogleEvent={sendGoogleEvent}
          openDeleteReasonModal={openDeleteReasonModal}
          setReasonToDelete={setReasonToDelete}
          reasonToDelete={reasonToDelete}
          onSendDeleteReason={onSendDeleteReason}
          onRemove={onRemove}
        />
      ) : null}
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
