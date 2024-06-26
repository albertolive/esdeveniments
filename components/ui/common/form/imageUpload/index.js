import Image from "next/image";
import { useRef, useState } from "react";
import UploadIcon from "@heroicons/react/outline/UploadIcon";

export default function ImageUploader({ value, onUpload, progress }) {
  const fileSelect = useRef(null);
  const [imgData, setImgData] = useState(value);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload() {
    if (fileSelect.current) {
      fileSelect.current.click();
    }
  }

  function handleFileValidation(file) {
    const acceptedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!acceptedImageTypes.includes(file.type)) {
      setError(
        "El fitxer seleccionat no és una imatge suportada. Si us plau, carregueu un fitxer en format JPEG, PNG, JPG, o WEBP."
      );
      return false;
    }
    if (file.size > 5000000) {
      setError(
        "La mida de l'imatge supera el límit permès de 5 MB. Si us plau, trieu una imatge més petita."
      );
      return false;
    }

    setError("");

    return true;
  }

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    if (file && handleFileValidation(file)) {
      updateImage(file);
      onUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && handleFileValidation(file)) {
      updateImage(file);
      onUpload(file);
    }
  };

  const updateImage = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgData(reader.result);
    });
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full text-blackCorp">
      <label htmlFor="image" className="text-blackCorp font-bold">
        Imatge *
      </label>

      <div
        className={`mt-2 border ${
          dragOver ? "border-primary" : "border-bColor"
        } rounded-xl cursor-pointer`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <form className="flex justify-center items-center h-full">
          {progress === 0 ? (
            <div className="text-center">
              <button
                className="bg-whiteCorp hover:bg-primary font-bold px-2 py-2 rounded-xl"
                onClick={handleImageUpload}
                type="button"
              >
                <UploadIcon className="w-6 h-6 text-blackCorp hover:text-whiteCorp" />
              </button>
            </div>
          ) : (
            <span className="text-blackCorp">{progress}%</span>
          )}

          <input
            ref={fileSelect}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            style={{ display: "none" }}
            onChange={onChangeImage}
          />
        </form>
        {error && <p className="text-primary text-sm mt-2">{error}</p>}
      </div>
      {imgData && (
        <div className="flex justify-center items-start p-4">
          <button
            onClick={() => setImgData(null)}
            className="bg-whiteCorp rounded-full p-1 hover:bg-primary"
          >
            <svg
              title="Esborra imatge"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blackCorp hover:text-whiteCorp"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Image
            alt="Imatge"
            height="100"
            width="100"
            className="object-contain"
            src={imgData}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      )}
    </div>
  );
}
