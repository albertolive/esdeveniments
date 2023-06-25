import Image from "next/image";
import { useRef, useState } from "react";

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
    <div className="sm:col-span-6">
      <label
        htmlFor="first-name"
        className="block text-sm font-medium text-gray-700"
      >
        Imatge *
      </label>

      <div
        className={`mt-1 border-2 border-dashed rounded-lg p-2 ${
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
            <div className="text-gray-700 text-center">
              <button
                className="bg-gray-800 hover:bg-[#ECB84A] text-white font-bold px-4 py-2 rounded block m-auto"
                onClick={handleImageUpload}
                type="button"
              >
                Navega
              </button>
            </div>
          ) : (
            <span className="text-gray-700">{progress}%</span>
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
        <div className="next-image-wrapper mt-2 relative">
          <Image
            alt="Imatge"
            height="100"
            width="150"
            className="object-contain rounded-lg"
            src={imgData}
          />
          <button
            onClick={() => setImgData(null)}
            className="absolute top-0 left-0  bg-white rounded-full p-1 hover:bg-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-500 hover:text-white"
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
        </div>
      )}
    </div>
  );
}
