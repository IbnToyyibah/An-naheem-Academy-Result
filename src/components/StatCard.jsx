export default function StatCard({ label, value }) {
  return (
    <article className="rounded-lg border border-line bg-white p-[18px]">
      <span className="font-bold text-muted">{label}</span>
      <strong className="mt-2 block text-2xl font-extrabold max-[520px]:text-xl">{value ?? 0}</strong>
    </article>
  );
}
