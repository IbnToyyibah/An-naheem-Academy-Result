import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api.js';

const resources = [
  ['classes', 'class_name', 'Classes'],
  ['subjects', 'subject_name', 'Subjects'],
  ['sessions', 'session_name', 'Sessions'],
  ['terms', 'term_name', 'Terms']
];

const panel = 'min-w-0 rounded-lg border border-line bg-panel p-[18px] shadow-panel max-[520px]:p-3.5';
const iconButton = 'inline-grid h-[38px] w-[38px] place-items-center rounded-[7px] border border-line bg-white';

export default function Settings() {
  const [data, setData] = useState({});
  const [drafts, setDrafts] = useState({});
  const [subjectLevel, setSubjectLevel] = useState('junior');

  async function load() {
    const entries = await Promise.all(resources.map(async ([path]) => [path, await api(`/${path}`)]));
    setData(Object.fromEntries(entries));
  }

  useEffect(() => {
    load();
  }, []);

  async function add(path, column) {
    if (!drafts[path]) return;
    const payload = { [column]: drafts[path] };
    if (path === 'subjects') {
      payload.class_levels = subjectLevel === 'both' ? ['junior', 'senior'] : [subjectLevel];
    }
    await api(`/${path}`, { method: 'POST', body: JSON.stringify(payload) });
    setDrafts({ ...drafts, [path]: '' });
    await load();
  }

  async function remove(path, id) {
    if (!confirm('Delete this item?')) return;
    await api(`/${path}/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <section>
      <header className="mb-5 flex items-start justify-between gap-4 max-[760px]:grid">
        <h1>Settings</h1>
        <p>Manage classes, subjects, academic sessions, and terms.</p>
      </header>
      <div className="grid grid-cols-2 gap-3.5 max-[760px]:grid-cols-1">
        {resources.map(([path, column, title]) => (
          <section className={panel} key={path}>
            <h2>{title}</h2>
            <div className={`mb-3 grid gap-2 ${path === 'subjects' ? 'grid-cols-1 sm:grid-cols-[1fr_auto_auto]' : 'grid-cols-[1fr_auto]'}`}>
              <input value={drafts[path] || ''} onChange={(e) => setDrafts({ ...drafts, [path]: e.target.value })} placeholder={`New ${title.toLowerCase()}`} />
              {path === 'subjects' && (
                <select
                  value={subjectLevel}
                  onChange={(event) => setSubjectLevel(event.target.value)}
                  aria-label="Subject class level"
                  className="min-w-0"
                >
                  <option value="junior">JSS only</option>
                  <option value="senior">SS only</option>
                  <option value="both">JSS and SS</option>
                </select>
              )}
              <button className={iconButton} onClick={() => add(path, column)} aria-label={`Add ${title}`}><Plus size={18} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(data[path] || []).map((item) => (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-[9px] py-[7px] font-bold" key={item.id}>
                  {item[column]}
                  {path === 'subjects' && (
                    <span className="text-[10px] font-semibold text-slate-500">
                      {(item.class_levels || ['junior']).map((level) => level === 'junior' ? 'JSS' : 'SS').join(' + ')}
                    </span>
                  )}
                  <button className="grid place-items-center border-0 bg-transparent text-accent" onClick={() => remove(path, item.id)} aria-label="Delete"><Trash2 size={14} /></button>
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
