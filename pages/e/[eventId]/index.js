import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useRouter } from "next/router";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import LocationIcon from "@heroicons/react/outline/LocationMarkerIcon";
import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";
import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import CloudIcon from "@heroicons/react/outline/CloudIcon";
import InfoIcon from "@heroicons/react/outline/InformationCircleIcon";
import ArrowRightIcon from "@heroicons/react/outline/ArrowRightIcon";
import SpeakerphoneIcon from "@heroicons/react/outline/SpeakerphoneIcon";
import ShareIcon from "@heroicons/react/outline/ShareIcon";
import WebIcon from "@heroicons/react/outline/GlobeAltIcon";
import { useGetEvent } from "@components/hooks/useGetEvent";
import Meta from "@components/partials/seo-meta";
import { generateJsonData, getTownValueByLabel } from "@utils/helpers";
import ViewCounter from "@components/ui/viewCounter";
import ReportView from "@components/ui/reportView";
import CardShareButton from "@components/ui/common/cardShareButton";
import useOnScreen from "@components/hooks/useOnScreen";
import { siteUrl } from "@config/index";
import { sendGoogleEvent } from "@utils/analytics";

const AdArticle = dynamic(() => import("@components/ui/adArticle"), {
  loading: () => "",
  ssr: false,
});

const Image = dynamic(() => import("@components/ui/common/image"), {
  loading: () => "",
});

const EditModal = dynamic(() => import("@components/ui/editModal"), {
  loading: () => "",
  ssr: false,
});

const Maps = dynamic(() => import("@components/ui/maps"), {
  loading: () => "",
  ssr: false,
});

const NoEventFound = dynamic(
  () => import("@components/ui/common/noEventFound"),
  {
    loading: () => "",
    ssr: false,
  }
);

const Notification = dynamic(
  () => import("@components/ui/common/notification"),
  {
    loading: () => "",
    ssr: false,
  }
);

const Weather = dynamic(() => import("@components/ui/weather"), {
  loading: () => "",
  ssr: false,
});

const ImageDefault = dynamic(() => import("@components/ui/imgDefault"), {
  loading: () => "",
});

const EventsAround = dynamic(() => import("@components/ui/eventsAround"), {
  loading: () => "",
  ssr: false,
});

const Tooltip = dynamic(() => import("@components/ui/tooltip"), {
  loading: () => "",
  ssr: false,
});

const Description = dynamic(() => import("@components/ui/common/description"), {
  loading: () => "",
});

const VideoDisplay = dynamic(
  () => import("@components/ui/common/videoDisplay"),
  {
    loading: () => "",
  }
);

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

// Helper function to sanitize input
const sanitizeInput = (input) =>
  input
    .replace(/(<([^>]+)>)/gi, "") // Remove HTML tags
    .replace(/&nbsp;/gi, " ") // Replace non-breaking spaces
    .replace(/"/gi, "") // Remove double quotes
    .replace(/\n/gi, " ") // Replace newline characters with space
    .trim(); // Trim leading and trailing spaces

// Helper function to smartly truncate text to a max length without cutting words
const smartTruncate = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  const lastSpaceIndex = text.substring(0, maxLength).lastIndexOf(" ");
  return lastSpaceIndex > maxLength - 20
    ? text.substring(0, lastSpaceIndex)
    : text.substring(0, maxLength);
};

function generateMetaDescription(title, description) {
  const titleSanitized = sanitizeInput(title);
  let metaDescription = titleSanitized;

  if (metaDescription.length < 120) {
    const descriptionSanitized = sanitizeInput(description);
    metaDescription += ` - ${descriptionSanitized}`;
  }

  metaDescription = smartTruncate(metaDescription, 156);

  return metaDescription;
}

function generateMetaTitle(title, description, location, town) {
  const titleSanitized = sanitizeInput(title);
  let metaTitle = smartTruncate(titleSanitized, 60);

  // Combine location and town, and sanitize the input
  let locationTown = "";
  if (
    location &&
    town &&
    metaTitle.length + location.length + town.length + 5 <= 60
  ) {
    locationTown = sanitizeInput(location + ", " + town).trim();
  } else if (location && metaTitle.length + location.length + 3 <= 60) {
    locationTown = sanitizeInput(location).trim();
  }

  // Only append location and town if they are not empty and fit within the limit
  if (locationTown) {
    metaTitle = `${metaTitle} - ${locationTown}`;
    metaTitle = smartTruncate(metaTitle, 60);
  }

  // Check if there's enough space and description is provided before appending
  if (metaTitle.length < 50 && description && description.trim() !== "") {
    const descriptionSanitized = sanitizeInput(description);
    metaTitle = `${metaTitle} - ${descriptionSanitized}`;
    metaTitle = smartTruncate(metaTitle, 60);
  }

  return metaTitle;
}

function renderEventImage(
  imageUploaded,
  title,
  location,
  nameDay,
  formattedStart
) {
  if (imageUploaded) {
    return (
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
          priority={true}
        />
      </a>
    );
  } else {
    const date = `${nameDay} ${formattedStart}`;

    return (
      <div className="w-full">
        <div className="w-full border-t"></div>
        <ImageDefault date={date} location={location} alt={title} />
      </div>
    );
  }
}

export default function Event(props) {
  const mapsRef = useRef();
  const eventsAroundRef = useRef();
  const isMapsVisible = useOnScreen(mapsRef);
  const isEventsAroundVisible = useOnScreen(eventsAroundRef, {
    freezeOnceVisible: true,
  });
  const { query } = useRouter();
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
    if (data?.event) {
      let place =
        getTownValueByLabel(data.event.town) ||
        getTownValueByLabel(data.event.region);

      if (place) {
        const currentPage = window.localStorage.getItem("currentPage");
        if (currentPage !== null && Number(currentPage) === 1) {
          window.localStorage.setItem("place", place);
        }
      }
    }
  }, [data?.event]);

  useEffect(() => {
    sendGoogleEvent("view_event_page");
  }, []);

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
    imageUploaded,
    eventImage,
    eventUrl,
    videoUrl,
    timeUntil,
    durationInHours,
  } = data.event;

  const jsonData = generateJsonData({ ...data.event, imageUploaded });

  if (title === "CANCELLED") return <NoEventFound />;

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
        title={generateMetaTitle(title, "", location, town)}
        description={generateMetaDescription(
          `${title} - ${nameDay} ${formattedStart} - ${location}, ${town}, ${region}`,
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
          <article className="w-full flex flex-col justify-center items-start gap-8">
            {/* Image */}
            <div className="w-full flex flex-col justify-center items-start gap-4">
              {videoUrl ? (
                <VideoDisplay videoUrl={videoUrl} />
              ) : (
                renderEventImage(
                  imageUploaded,
                  title,
                  location,
                  nameDay,
                  formattedStart
                )
              )}
              {/* ShareButton */}
              <div className="w-full flex justify-between items-center px-4">
                <CardShareButton slug={slug} />
                <ViewCounter slug={slug} />
              </div>
            </div>
            {/* Small date and title */}
            <div className="w-full flex flex-col justify-start items-start gap-2 px-4">
              <p className="font-semibold">
                {formattedEnd ? (
                  <>
                    <time dateTime={formattedStart}>Del {formattedStart}</time>{" "}
                    al <time dateTime={formattedEnd}>{formattedEnd}</time>
                  </>
                ) : (
                  <>
                    <time dateTime={formattedStart}>
                      {nameDay}, {formattedStart}
                    </time>
                  </>
                )}
              </p>
              <h1 className="w-full uppercase">{title}</h1>
            </div>
            {/* Full date */}
            <div className="w-full flex justify-center items-start gap-2 px-4">
              <CalendarIcon className="w-5 h-5 mt-1" />
              <div className="w-11/12 flex flex-col gap-4">
                <h2>Data i hora</h2>
                <div className="w-full flex flex-col gap-4">
                  <p>
                    {formattedEnd
                      ? `Del ${formattedStart} al ${formattedEnd}`
                      : `${nameDay}, ${formattedStart}`}
                  </p>
                  <p className="capitalize">
                    {isFullDayEvent
                      ? "Consultar horaris"
                      : `${startTime} - ${endTime}`}
                  </p>
                </div>
              </div>
            </div>
            {/* Location */}
            <div className="w-full flex justify-center items-start gap-2 px-4">
              <LocationIcon className="h-5 w-5 mt-1" aria-hidden="true" />
              <div className="w-11/12 flex flex-col gap-4 pr-4">
                <h2>Ubicació</h2>
                {/* Show Map Button */}
                <div className="w-full flex flex-col justify-center items-center gap-4">
                  <div className="w-full flex flex-col justify-center items-start gap-4">
                    <div className="w-full flex flex-col justify-start items-start gap-1">
                      <p>{location}</p>{" "}
                      <p>
                        {town}, {region}, {postalCode}
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
              <div
                className="w-full flex flex-col justify-center items-end gap-6"
                ref={mapsRef}
              >
                {isMapsVisible && <Maps location={mapsLocation} />}
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
            {/* Ad */}
            <div className="w-full h-full flex justify-center items-start px-4 min-h-[250px] gap-2">
              <SpeakerphoneIcon className="w-5 h-5 mt-1" />
              <div className="w-11/12 flex flex-col gap-4">
                <h2>Contingut patrocinat</h2>
                <AdArticle slot="9643657007" />
              </div>
            </div>
            {/* Description */}
            <Description description={description} />
            {videoUrl &&
              renderEventImage(
                imageUploaded,
                title,
                location,
                nameDay,
                formattedStart
              )}
            {/* Weather */}
            <div className="w-full flex justify-center items-start gap-2 px-4">
              <CloudIcon className="w-5 h-5 mt-1" />
              <div className="w-11/12 flex flex-col gap-4">
                <h2>El temps</h2>
                <Weather startDate={startDate} />
              </div>
              <span ref={eventsAroundRef} />
            </div>
            {/* More info */}
            <div className="w-full flex justify-center items-start gap-2 px-4">
              <WebIcon className="w-5 h-5 mt-1" />
              <div className="w-11/12 flex flex-col gap-4">
                <h2>Detalls de l&apos;Esdeveniment</h2>{" "}
                <div className="flex justify-start items-center gap-2">
                  <div className="flex items-center gap-1 font-normal">
                    {timeUntil}
                  </div>
                </div>
                {durationInHours && (
                  <div className="flex justify-start items-center gap-2">
                    <div className="flex items-center gap-1 font-normal">
                      Durada aproximada: {durationInHours}
                    </div>
                  </div>
                )}
                <div className="font-bold">
                  Enllaç a l&apos;esdeveniment:
                  <a
                    className="text-primary hover:underline font-normal ml-1"
                    href={eventUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {title}
                  </a>
                </div>
              </div>
            </div>
            {/* EditButton */}
            <div className="w-full flex justify-center items-start gap-2 px-4">
              <PencilIcon className="w-5 h-5 mt-1" />
              <div className="w-11/12 flex flex-col gap-4">
                <h2>Suggerir un canvi</h2>
                <div className="w-11/12 flex justify-start items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => {
                      setOpenModal(true);
                      sendGoogleEvent("open-change-modal");
                    }}
                    className="gap-2 ease-in-out duration-300 border-whiteCorp hover:border-blackCorp"
                  >
                    <p className="font-medium flex items-center">Editar</p>
                  </div>
                  <InfoIcon className="w-5 h-5" data-tooltip-id="edit-button" />
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
            {/* EventsAround */}
            {isEventsAroundVisible && (
              <div className="w-full flex justify-center items-start gap-2 px-4">
                <ShareIcon className="w-5 h-5 mt-1" />
                <div className="w-11/12 flex flex-col gap-4">
                  <h2>Esdeveniments relacionats</h2>
                  <EventsAround
                    id={id}
                    title={title}
                    town={town}
                    region={region}
                  />
                </div>
              </div>
            )}
            {/* Ad */}
            <div className="w-full h-full flex justify-center items-start px-4 min-h-[250px] gap-2">
              <SpeakerphoneIcon className="w-5 h-5 mt-1" />
              <div className="w-11/12 flex flex-col gap-4">
                <h2>Contingut patrocinat</h2>
                <AdArticle slot="9643657007" />
              </div>
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
