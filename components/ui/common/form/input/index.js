export default function Input({ id, title, subtitle, value, onChange }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="text-blackCorp font-bold">
        {title}
      </label>
      <div className="mt-2">
        {subtitle ? <p className="text-[12px] p-2">{subtitle}</p> : null}
        <input
          value={value}
          onChange={onChange}
          type="text"
          name={id}
          id={id}
          className="w-full rounded-xl border-bColor focus:border-darkCorp"
        />
      </div>
    </div>
  );
}
