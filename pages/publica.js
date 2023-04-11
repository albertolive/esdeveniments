import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
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

const Notification = dynamic(
  () => import("@components/ui/common/notification"),
  {
    loading: () => "",
  }
);

const defaultForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
  frequency: "",
  imageUploaded: false,
};

const _createFormState = (
  isDisabled = true,
  isPristine = true,
  message = ""
) => ({
  isDisabled,
  isPristine,
  message,
});

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

  if (!startDate) {
    return _createFormState(true, true, "Data inici obligatòria");
  }

  if (!endDate) {
    return _createFormState(true, true, "Data final obligatòria");
  }

  if (endDate.getTime() <= startDate.getTime()) {
    return _createFormState(
      true,
      true,
      "Data final no pot ser anterior o igual a la data inici"
    );
  }

  return _createFormState(false);
};

export default function Publica() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [formState, setFormState] = useState(_createFormState());
  const [isLoading, setIsLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [hideNotification, setHideNotification] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleChangeFrequencyLocation = ({ value }) =>
    handleFormChange("frequency", value);

  const goToEventPage = (url) => ({
    pathname: `${url}`,
    query: { newEvent: true },
  });

  const onSubmit = async () => {
    const newFormState = createFormState(
      form,
      formState.isPristine,
      null,
      true
    );

    setFormState(newFormState);

    if (!newFormState.isDisabled) {
      setIsLoading(true);

      const rawResponse = await fetch(process.env.NEXT_PUBLIC_CREATE_EVENT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, imageUploaded: !!imageToUpload }),
      });
      const { id } = await rawResponse.json();

      const { formattedStart } = getFormattedDate(form.startDate, form.endDate);
      const slugifiedTitle = slug(form.title, formattedStart, id);

      imageToUpload
        ? uploadFile(id, slugifiedTitle)
        : router.push(goToEventPage(`/${slugifiedTitle}`));
    }
  };

  const uploadFile = (id, slugifiedTitle) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.upload.addEventListener("progress", (e) => {
      setProgress(Math.round((e.loaded * 100.0) / e.total));
    });

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const public_id = JSON.parse(xhr.responseText).public_id;
        console.log(public_id);
        router.push(goToEventPage(`/${slugifiedTitle}`));
      }
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

  const notificationTitle =
    "Avís! Preveient que s'acosta un any electoral, us volíem informar que Cultura Cardedeu no és un espai per a la publicació d'actes de partits polítics i quan en detectem algun, l'eliminarem. Considerem que els partits ja tenen els seus canals i volem deixar aquest espai per a les entitats i iniciatives culturals. Gràcies per la comprensió!";

  return (
    <>
      <Meta
        title="Publica - Cultura Cardedeu"
        description="Publica un acte cultural - Cultura Cardedeu"
        canonical="https://www.culturacardedeu.com/publica"
      />
      {!hideNotification && (
        <Notification
          type="warning"
          customNotification={false}
          hideNotification={() => setHideNotification(true)}
          title={notificationTitle}
        />
      )}
      <div className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Publica un acte cultural
              </h3>
              <p className="mt-1 text-sm text-gray-500">* camps obligatoris</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <Input
                id="title"
                title="Títol *"
                value={form.title}
                onChange={handleChange}
              />

              <TextArea
                id="description"
                value={form.description}
                onChange={handleChange}
              />

              <ImageUpload
                value={imageToUpload}
                onUpload={setImageToUpload}
                progress={progress}
              />

              <Select
                id="location"
                value={form.location}
                title="Localització *"
                onChange={handleChangeLocation}
                isValidNewOption
              />

              <DatePicker
                startDate={form.start}
                endDate={form.end}
                onChange={handleChangeDate}
              />

              <FrequencySelect
                id="frequency"
                value={form.frequency}
                title="Freqüència"
                onChange={handleChangeFrequencyLocation}
              />
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
            <button
              disabled={isLoading}
              onClick={onSubmit}
              className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-[#ECB84A] ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
            >
              {isLoading ? (
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
                  Publicant ...
                </>
              ) : (
                "Publica"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
