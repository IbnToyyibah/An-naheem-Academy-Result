export default function StatCard({ label, value }) {
  return (
    <article className="rounded-lg border border-line bg-white p-[18px]">
      <span className="font-bold text-muted">{label}</span>
      <strong className="mt-2 block text-3xl font-extrabold max-[520px]:text-2xl">{value ?? 0}</strong>
    </article>
  );
}
