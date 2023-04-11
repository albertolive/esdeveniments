export default function List({ events, children }) {
  return (
    <section className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mb-5">
      {events.map((event) => children(event))}
    </section>
  );
}
