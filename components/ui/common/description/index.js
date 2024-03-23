import ReactHtmlParser from "react-html-parser";
import DocumentIcon from "@heroicons/react/outline/DocumentIcon";

export default function Description({ description }) {
  return (
    <div className="w-full flex justify-center items-start gap-2 px-4">
      <DocumentIcon className="w-5 h-5 mt-1" />
      <div className="w-11/12 flex flex-col gap-4">
        <h2>Descripció</h2>
        <div className="w-full break-words overflow-hidden">
          {ReactHtmlParser(description)}
        </div>
      </div>
    </div>
  );
}
