import { memo } from "react";

function List({ events, children, title, subTitle, hideTitle }) {
  return (
    <>
      {!hideTitle && (
        <>
          <h1 className="leading-8 font-semibold text-blackCorp text-left uppercase italic mb-4 px-4">
            {title}
          </h1>
          <h2 className="text-[16px] font-normal text-blackCorp text-left mb-4 px-4">
            {subTitle}
          </h2>
        </>
      )}
      <section className="flex flex-col justify-center items-center">
        {events.map((event) => children(event))}
      </section>
    </>
  );
}

export default memo(List);
