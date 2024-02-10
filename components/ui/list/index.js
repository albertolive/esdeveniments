import { memo } from "react";

function List({ events, children, title, hideTitle }) {
  return (
    <>
      {!hideTitle && (
        <h1 className="leading-8 font-semibold text-blackCorp text-left uppercase italic mb-4 px-4">
          {title}
        </h1>
      )}
      <section className="flex flex-col justify-center items-center">
        {events.map((event) => children(event))}
      </section>
    </>
  );
}

export default memo(List);
