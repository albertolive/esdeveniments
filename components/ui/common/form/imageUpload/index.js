import Image from "next/image";
import { useRef, useState } from "react";

export default function ImageUploader({ value, onUpload, progress }) {
  const fileSelect = useRef(null);
  const [imgData, setImgData] = useState(value);

  async function handleImageUpload() {
    if (fileSelect) {
      fileSelect.current.click();
    }
  }

  const onChangeImage = (e) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgData(reader.result);
    });
    reader.readAsDataURL(e.target.files[0]);

    onUpload(e.target.files[0]);
  };

  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="first-name"
        className="block text-sm font-medium text-gray-700"
      >
        Imatge
      </label>
      {imgData && (
        <div className="next-image-wrapper">
          <Image
            alt="Imatge"
            height="100"
            width="150"
            className="object-contain rounded-lg"
            src={imgData}
          />
        </div>
      )}
      <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-2">
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
    </div>
  );
}
