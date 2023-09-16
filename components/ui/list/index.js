export default function List({ events, children }) {
  return (
    <section className="flex flex-col max-w-[1024px]">
      {events.map((event) => children(event))}
    </section>
  );
}
