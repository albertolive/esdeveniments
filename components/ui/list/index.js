import { memo } from "react";

function List({ events, children }) {
  return (
    <section className="flex flex-col justify-center items-center">
      {events.map((event) => children(event))}
    </section>
  );
}

export default memo(List);
