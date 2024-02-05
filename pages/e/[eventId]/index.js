import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useRouter } from "next/router";
import { useGetEvent } from "@components/hooks/useGetEvent";
import Meta from "@components/partials/seo-meta";
import { generateJsonData } from "@utils/helpers";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import LocationIcon from "@heroicons/react/outline/LocationMarkerIcon";
import ReactHtmlParser from "react-html-parser";
import ViewCounter from "@components/ui/viewCounter";
import { siteUrl } from "@config/index";
import ReportView from "@components/ui/reportView";
import CardShareButton from "@components/ui/common/cardShareButton";
import { truncateString } from "@utils/helpers";
import ChevronUpIcon from "@heroicons/react/outline/ChevronUpIcon";
import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";
import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import CloudIcon from "@heroicons/react/outline/CloudIcon";
import InfoIcon from "@heroicons/react/outline/InformationCircleIcon";
import DocumentIcon from "@heroicons/react/outline/DocumentIcon";
import ArrowRightIcon from "@heroicons/react/outline/ArrowRightIcon";
import { Tooltip } from "react-tooltip";

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

const Weather = dynamic(() => import("@components/ui/weather"), {
  loading: () => "",
});

const ImageDefault = dynamic(() => import("@components/ui/imgDefault"), {
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
  const [hasError, setHasError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (newEvent || edit_suggested) return;

    if (title !== "CANCELLED" && slug && asPath !== `/e/${slug}`) {
      // push(slug, undefined, { shallow: true });
      localStorage.setItem("e slug", `/e/${slug}`);
      localStorage.setItem("asPath", asPath);
    }
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
    town,
    region,
    postalCode,
    mapsLocation,
    startDate,
    startTime,
    endTime,
    isFullDayEvent,
    nameDay,
    formattedStart,
    formattedEnd,
    tag,
    imageUploaded,
    isEventFinished,
    eventImage,
  } = data.event;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionToShow = isExpanded
    ? description
    : truncateString(description || "", 220);

  const jsonData = generateJsonData({ ...data.event, imageUploaded });

  if (title === "CANCELLED") return <NoEventFound />;

  function ImgDefault() {
    const date = `${nameDay} ${formattedStart}`;
    if (!imageUploaded || hasError) {
      return (
        <div className="w-full">
          <div className="w-full border-t"></div>
          <ImageDefault date={date} location={location} alt={title} />
        </div>
      );
    }
  }

  const handleDirectionsClick = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${location}`,
      "_blank"
    );
  };

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
      <ReportView slug={slug} />
      {newEvent && <Notification title={title} url={slug} />}
      {showThankYouBanner && (
        <Notification
          customNotification={false}
          hideClose
          hideNotification={setShowThankYouBanner}
          title="Gràcies per contribuir a millorar el contingut de Esdeveniments.cat! En menys de 24 hores estarà disponible el canvi."
        />
      )}
      {/* General */}
      <div className="w-full flex justify-center bg-whiteCorp pb-10">
        <div className="w-full flex flex-col justify-center items-center gap-4 sm:w-[520px] md:w-[520px] lg:w-[520px]">
          {isEventFinished && (
            <p className="w-full font-medium text-primary">
              Aquest esdeveniment ha finalitzat
            </p>
          )}
          <article className="w-full flex flex-col justify-center items-start gap-8">
            {/* Image */}
            <div className="w-full flex flex-col justify-center items-start gap-4">
              {imageUploaded ? (
                <a
                  href={imageUploaded}
                  className="flex justify-center"
                  target="_blank"
                  rel="image_src noreferrer"
                >
                  <Image
                    alt={title}
                    title={title}
                    image={imageUploaded}
                    className="w-full object-center object-cover"
                  />
                </a>
              ) : (
                <ImgDefault />
              )}
              {/* ShareButton */}
              <div className="w-full flex justify-between items-center px-4">
                <CardShareButton slug={slug} />
                <ViewCounter slug={slug} />
              </div>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-2 px-4">
              <p className="font-medium">
                {formattedEnd
                  ? `Del ${formattedStart} al ${formattedEnd}`
                  : `${nameDay}, ${formattedStart}`}
              </p>
              <h1 className="w-full uppercase">{title}</h1>
            </div>
            {/* Description */}
            <div className="w-full flex justify-center items-start gap-2 px-4">
              <DocumentIcon className="w-5 h-5 mt-1" />
              <div className="w-11/12 flex flex-col gap-4">
                <h3>Descripció</h3>
                <div className="w-full break-words overflow-hidden">
                  {ReactHtmlParser(descriptionToShow)}
                  <div
                    className="w-fit flex justify-start items-center gap-2 pt-4 border-b-2 border-whiteCorp hover:border-b-2 hover:border-blackCorp ease-in-out duration-300 cursor-pointer"
                    onClick={toggleExpanded}
                  >
                    <button className="font-medium">
                      {isExpanded ? (
                        <p className="pt-4">Reduir descripció</p>
                      ) : (
                        <p>Descripció completa</p>
                      )}
                    </button>
                    <div>
                      {isExpanded ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Info */}
            <div className="w-full flex flex-col justify-start items-start gap-4">
              <div className="w-full flex justify-center items-start gap-2 px-4">
                <CalendarIcon className="w-5 h-5 mt-1" />
                <div className="w-11/12 flex flex-col gap-4">
                  <h3>Data i hora</h3>
                  <div className="w-full flex flex-col gap-4">
                    <p>
                      {formattedEnd
                        ? `Del ${formattedStart} al ${formattedEnd}`
                        : `${nameDay}, ${formattedStart}`}
                    </p>
                    <p className="uppercase">
                      {isFullDayEvent
                        ? "Consultar horaris"
                        : `${startTime} - ${endTime}`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center items-start gap-2 px-4">
                <CloudIcon className="w-5 h-5 mt-1" />
                <div className="w-11/12 flex flex-col gap-4">
                  <h3>El temps</h3>
                  <Weather startDate={startDate} />
                </div>
              </div>
              <div className="w-full flex justify-center items-start gap-2 px-4">
                <LocationIcon className="h-5 w-5 mt-1" aria-hidden="true" />
                <div className="w-11/12 flex flex-col gap-4 pr-4">
                  <h3>Ubicació</h3>
                  {/* Show Map Button */}
                  <div className="w-full flex flex-col justify-center items-center gap-4">
                    <div className="w-full flex flex-col justify-center items-start gap-4">
                      <div className="w-full flex flex-col justify-start items-start gap-1">
                        <p>{location}</p>{" "}
                        <p>
                          {postalCode} {town}, {region}
                        </p>
                      </div>
                      <div
                        className="w-fit flex justify-start items-center gap-2 border-b-2 border-whiteCorp hover:border-b-2 hover:border-blackCorp ease-in-out duration-300 cursor-pointer"
                        onClick={handleShowMap}
                      >
                        <button type="button" className="flex gap-2">
                          <p className="font-medium">Mostrar mapa</p>
                          {showMap ? (
                            <XIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <ChevronDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showMap && (
                <div className="w-full flex flex-col justify-center items-end gap-6 overflow-hidden">
                  <Maps location={mapsLocation} />
                  <div className="w-fit flex justify-end items-center gap-2 px-4 border-b-2 border-whiteCorp hover:border-b-2 hover:border-blackCorp ease-in-out duration-300 cursor-pointer">
                    <button
                      className="flex gap-2"
                      onClick={handleDirectionsClick}
                    >
                      <p className="font-medium">Com arribar</p>
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              {/* EditButton */}
              <div className="w-full flex justify-center items-start gap-2 px-4">
                <PencilIcon className="w-5 h-5 mt-1" />
                <div className="w-11/12 flex flex-col gap-4">
                  <h3>Suggerir un canvi</h3>
                  <div className="w-11/12 flex justify-start items-center gap-2 cursor-pointer">
                    <button
                      onClick={() => {
                        setOpenModal(true);
                        sendGoogleEvent("open-change-modal");
                      }}
                      type="button"
                      className="flex justify-start items-center gap-2 ease-in-out duration-300 border-b-2 border-whiteCorp hover:border-blackCorp"
                    >
                      <p className="font-medium">Editar</p>
                    </button>
                    <InfoIcon
                      className="w-5 h-5"
                      data-tooltip-id="edit-button"
                    />
                    <Tooltip id="edit-button">
                      Si després de veure la informació de l&apos;esdeveniment,
                      <br />
                      veus que hi ha alguna dada erronia o vols ampliar la
                      <br />
                      informació, pots fer-ho al següent enllaç. Revisarem el
                      <br />
                      canvi i actualitzarem l&apos;informació.
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full px-4 min-h-[280px] lg:min-h-[100px]">
              <AdArticle slot="9643657007" />
            </div>
          </article>

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
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
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

  event.description = isHTML(event.description)
    ? event.description
    : replaceURLs(event.description);

  return {
    props: { event },
    revalidate: 60,
  };
}
