/** Shared glass section wrapper: heading + content. */
export default function Section({ id, title, children, className = "" }) {
  return (
    <section aria-labelledby={id} className={`glass p-5 ${className}`}>
      <h2 id={id} className="mb-3 text-lg font-bold text-accent2">{title}</h2>
      {children}
    </section>
  );
}
