export default function EmptyState({ title = 'No records found' }) {
  return <div className="p-6 text-center text-muted">{title}</div>;
}
