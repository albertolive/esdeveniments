import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
];

export default function TextArea({ id, value = "", onChange }) {
  const onChangeContent = (value) => onChange({ target: { name: id, value } });

  return (
    <div className="w-full">
      <label htmlFor="first-name" className="text-blackCorp">
        Descripció *
      </label>
      <div className="mt-2">
        <ReactQuill
          id={id}
          theme="snow"
          defaultValue={value}
          onChange={onChangeContent}
          preserveWhitespace
          modules={modules}
          formats={formats}
          className="w-full rounded-xl border-darkCorp focus:border-darkCorp"
        />
      </div>
    </div>
  );
}
