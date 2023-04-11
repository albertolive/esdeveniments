import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { slug, getFormattedDate } from "@utils/helpers";
import {
  DatePicker,
  Input,
  Select,
  FrequencySelect,
  TextArea,
  ImageUpload,
} from "@components/ui/common/form";
import Meta from "@components/partials/seo-meta";
import { Notification } from "@components/ui/common";

const _createFormState = (
  isDisabled = true,
  isPristine = true,
  message = ""
) => ({
  isDisabled,
  isPristine,
  message,
});

const defaultForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
  frequency: "",
  imageUploaded: false,
};

const createFormState = (
  { title, description, startDate, endDate, location },
  isPristine
) => {
  if (!isPristine) {
    return _createFormState(true, true, "");
  }

  if (!title || title.length < 10) {
    return _createFormState(true, true, "Títol obligatori, mínim 10 caràcters");
  }

  if (!description.replace(/(<([^>]+)>)/gi, "") || description.length < 15) {
    return _createFormState(
      true,
      true,
      "Descripció obligatòria, mínim 15 caràcters"
    );
  }

  if (!location) {
    return _createFormState(true, true, "Lloc obligatori");
  }

  const normalizedStartDate =
    typeof startDate === "string" ? new Date(startDate) : startDate;
  const normalizedEndDate =
    typeof endDate === "string" ? new Date(endDate) : endDate;

  if (!normalizedStartDate) {
    return _createFormState(true, true, "Data inici obligatòria");
  }

  if (!normalizedEndDate) {
    return _createFormState(true, true, "Data final obligatòria");
  }

  if (normalizedEndDate.getTime() <= normalizedStartDate.getTime()) {
    return _createFormState(
      true,
      true,
      "Data final no pot ser anterior o igual a la data inici"
    );
  }

  return _createFormState(false);
};

export default function Edita({ event }) {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [formState, setFormState] = useState(_createFormState());
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setForm(event);
  }, [event]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [showDeleteMessage]);

  const goToEventPage = (url) => ({
    pathname: `${url}`,
    query: { edit_suggested: true },
  });

  const handleFormChange = (name, value) => {
    const newForm = { ...form, [name]: value };

    setForm(newForm);
    setFormState(createFormState(newForm));
  };

  const handleChange = ({ target: { name, value } }) =>
    handleFormChange(name, value);

  const handleChangeDate = (name, value) => handleFormChange(name, value);

  const handleChangeLocation = ({ value }) =>
    handleFormChange("location", value);

  // const handleChangeFrequencyLocation = ({ value }) =>
  //   handleFormChange("frequency", value);

  // const onDelate = async () => {
  //   const { id, title } = form;
  //   setIsLoadingDelete(true);

  //   const rawResponse = await fetch(process.env.NEXT_PUBLIC_DELETE_EVENT, {
  //     method: "DELETE",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ id, title }),
  //   });

  //   const { success } = await rawResponse.json();

  //   if (success) setShowDeleteMessage(true);

  //   setIsLoadingDelete(false);
  // };

  const onSubmit = async () => {
    const newFormState = createFormState(
      form,
      formState.isPristine,
      null,
      true
    );

    setFormState(newFormState);

    if (!newFormState.isDisabled) {
      setIsLoadingEdit(true);

      const rawResponse = await fetch(process.env.NEXT_PUBLIC_EDIT_EVENT, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          imageUploaded: event.imageUploaded || !!imageToUpload,
        }),
      });

      await rawResponse.json();

      const { formattedStart } = getFormattedDate(form.startDate, form.endDate);
      const slugifiedTitle = slug(form.title, formattedStart, form.id);

      imageToUpload
        ? uploadFile(form.id, slugifiedTitle)
        : router.push(goToEventPage(`/${slugifiedTitle}`));
    }
  };

  const uploadFile = (id, slugifiedTitle) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", (e) => {
      setProgress(Math.round((e.loaded * 100.0) / e.total));
    });

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState == 4 && xhr.status == 200)
        router.push(goToEventPage(`/${slugifiedTitle}`));
    };

    fd.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET
    );
    fd.append("tags", "browser_upload");
    fd.append("file", imageToUpload);
    fd.append("public_id", id);
    xhr.send(fd);
  };

  return (
    <>
      <Meta
        title="Edita - Cultura Cardedeu"
        description="Edita - Cultura Cardedeu"
        canonical="https://www.culturacardedeu.com/edita"
      />
      {showDeleteMessage && (
        <Notification
          customNotification={false}
          hideNotification={setShowDeleteMessage}
          title="Estem revisant la teva sol·licitud. Si en menys de 24 hores no ha estat eliminat. Si us plau, posa't en contacte amb nosaltres a:"
          url="hola@culturacardedeu.com"
        />
      )}
      <div className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Editar - {form.title || event.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">* camps obligatoris</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <Input
                id="title"
                title="Títol *"
                value={form.title || event.title}
                onChange={handleChange}
              />

              <TextArea
                id="description"
                value={form.description || event.description}
                onChange={handleChange}
              />

              {event.imageUploaded ? (
                <div className="sm:col-span-6">
                  <div className="next-image-wrapper">
                    <Image
                      alt={form.title || event.title}
                      title={form.title || event.title}
                      height="100"
                      width="150"
                      className="object-contain rounded-lg"
                      src={form.imageUploaded || event.imageUploaded}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    * Si voleu canviar la imatge, poseu-vos en contacte amb
                    nosaltres. Estem treballant perquè es pugui fer des del
                    formulari.
                  </p>
                </div>
              ) : (
                <ImageUpload
                  value={imageToUpload}
                  onUpload={setImageToUpload}
                  progress={progress}
                />
              )}

              <Select
                id="location"
                value={form.location || event.location}
                title="Localització *"
                onChange={handleChangeLocation}
              />

              <DatePicker
                startDate={form.startDate || event.startDate}
                endDate={form.endDate || event.endDate}
                onChange={handleChangeDate}
              />

              <Input
                id="email"
                title="Correu electrònic"
                subtitle="Vols que t'avisem quan l'esdeveniment s'hagi actualitzat? (no guardem les dades)"
                onChange={handleChange}
              />

              {/* <FrequencySelect
                id="frequency"
                value={form.frequency || event.frequency}
                title="Recurrència"
                onChange={handleChangeFrequencyLocation}
              /> */}
            </div>
          </div>
        </div>
        {formState.isPristine && formState.message && (
          <div className="p-4 my-3 text-red-700 bg-red-200 rounded-lg text-sm">
            {formState.message}
          </div>
        )}
        <div className="pt-5">
          <div className="flex justify-end">
            {/* <button
              disabled={isLoadingDelete || isLoadingEdit}
              onClick={onDelate}
              className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-[#ECB84A] ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
            >
              {isLoadingDelete ? (
                <>
                  <svg
                    role="status"
                    className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Eliminant ...
                </>
              ) : (
                "Eliminar"
              )}
            </button> */}
            <button
              disabled={isLoadingEdit || isLoadingDelete}
              onClick={onSubmit}
              className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-[#ECB84A] ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
            >
              {isLoadingEdit ? (
                <>
                  <svg
                    role="status"
                    className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Editant ...
                </>
              ) : (
                "Editar"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { getCalendarEvent } = require("@lib/helpers");
  const eventId = params.eventId;

  const { event } = await getCalendarEvent(eventId);

  if (!event.id) {
    return {
      notFound: true,
    };
  }

  return {
    props: { event },
  };
}
