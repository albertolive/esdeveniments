export default function Input({ id, title, subtitle, value, onChange }) {
  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="first-name"
        className="block text-sm font-medium text-gray-700"
      >
        {title}
      </label>
      <div className="mt-1">
        {subtitle ? (
          <div className="mb-1 text-xs text-gray-500">{subtitle}</div>
        ) : null}
        <input
          value={value}
          onChange={onChange}
          type="text"
          name={id}
          id={id}
          className="shadow-sm focus:ring-gray-300 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}
