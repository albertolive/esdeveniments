import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

export default function TextArea({ id, value = "", onChange }) {
  const onChangeContent = (value) => onChange({ target: { name: id, value } });

  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="first-name"
        className="block text-sm font-medium text-gray-700"
      >
        Descripció *
      </label>
      <div className="mt-1">
        <ReactQuill
          id={id}
          theme="snow"
          defaultValue={value}
          onChange={onChangeContent}
          preserveWhitespace
          modules={modules}
          formats={formats}
          className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}
