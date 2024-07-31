import ReactHtmlParser from "react-html-parser";
import DocumentIcon from "@heroicons/react/outline/DocumentIcon";
import CulturalMessage from "../culturalMessage";

export default function Description({ description, location }) {
  return (
    <section className="w-full flex justify-center items-start gap-2 px-4">
      <DocumentIcon className="w-5 h-5 mt-1" aria-hidden="true" />
      <div className="w-11/12 flex flex-col gap-4">
        <h2>Descripció</h2>
        <div className="w-full break-words overflow-hidden">
          {ReactHtmlParser(description)}
          <CulturalMessage location={location} />
        </div>
      </div>
    </section>
  );
}
