import Image from "next/image";
import { useRef, useState } from "react";
import PlusSmIcon from "@heroicons/react/outline/PlusSmIcon";

export default function ImageUploader({ value, onUpload, progress }) {
  const fileSelect = useRef(null);
  const [imgData, setImgData] = useState(value);
  const [dragOver, setDragOver] = useState(false);

  async function handleImageUpload() {
    if (fileSelect) {
      fileSelect.current.click();
    }
  }

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    updateImage(file);
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file.type.startsWith("image/")) {
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
      <label
        htmlFor="first-name"
        className="text-blackCorp"
      >
        Imatge *
      </label>

      <div
        className={`m-2 p-4 border border-bColor rounded-xl cursor-pointer ${
          dragOver ? "border-green-600" : "border-gray-300"
        }`}
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
                <PlusSmIcon className="w-6 h-6 text-blackCorp hover:text-whiteCorp" />
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
      </div>
      {imgData && (
        <div className="flex justigy-center items-start p-4">
          <button
            onClick={() => setImgData(null)}
            className=" bg-white rounded-full p-1 hover:bg-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blackCorp hover:text-white"
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
            height="100%"
            width="100%"
            className="object-contain"
            src={imgData}
          />
        </div>
      )}
    </div>
  );
}
