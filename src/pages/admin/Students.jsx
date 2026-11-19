import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Plus, Search, Trash2, Upload, Edit, RefreshCw, Sparkles, Download, FileSpreadsheet } from 'lucide-react';
import { api, assetUrl } from '../../services/api.js';
import EmptyState from '../../components/EmptyState.jsx';

const blank = {
  admission_number: '',
  first_name: '',
  last_name: '',
  gender: 'Male',
  class_id: ''
};

const panel = 'min-w-0 rounded-lg border border-line bg-panel p-[18px] shadow-panel max-[520px]:p-3.5';
const formGrid = 'grid gap-3.5';
const twoGrid = 'grid grid-cols-2 gap-3 max-[760px]:grid-cols-1';
const primaryButton = 'flex items-center justify-center gap-2 rounded-[7px] border-0 bg-primary px-4 py-[11px] font-extrabold text-white transition hover:bg-primary-dark cursor-pointer';
const iconButton = 'inline-grid h-[38px] w-[38px] place-items-center rounded-[7px] border border-line bg-white cursor-pointer';

function normalizeAdmissionNumber(value = '') {
  const compact = String(value).trim().replace(/\\/g, '/');
  const match = compact.match(/^ana[\s/-]*(jss|ss)\s*([1-3])[\s/-]*(\d{1,3})[\s/-]*([a-z])$/i);

  if (!match) return compact.replace(/\s+/g, '');

  const prefix = match[1].toUpperCase();
  return `ANA/${prefix}${match[2]}/${match[3].padStart(3, '0')}${match[4].toLowerCase()}`;
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [bulkClassId, setBulkClassId] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [csvMessage, setCsvMessage] = useState('');
  const [importingCsv, setImportingCsv] = useState(false);
  const csvInputRef = useRef(null);
  const [form, setForm] = useState(blank);
  const [passport, setPassport] = useState(null);
  const [preview, setPreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [recordClassId, setRecordClassId] = useState('');
  const [recordGender, setRecordGender] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingAdm, setGeneratingAdm] = useState(false);

  const filtered = useMemo(() => students.filter((student) => {
    const matchesClass = !recordClassId || String(student.class_id) === recordClassId;
    const matchesGender = !recordGender || student.gender?.toLowerCase() === recordGender.toLowerCase();
    const matchesSearch = `${student.first_name} ${student.last_name} ${student.admission_number}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesClass && matchesGender && matchesSearch;
  }), [students, search, recordClassId, recordGender]);

  const fetchNextAdmissionNumber = useCallback(async (classId, classList = classes, studentList = students) => {
    if (!classId) return '';
    try {
      const res = await api(`/students/next-admission-number?classId=${classId}`);
      if (res?.admissionNumber) {
        return res.admissionNumber;
      }
    } catch {
      // Local fallback calculation based on class and students
      const targetClass = classList.find((c) => c.id === classId);
      const className = targetClass?.class_name || '';
      const m = className.match(/(JSS|SS)\s*([1-3])/i);
      const code = m ? `${m[1].toUpperCase()}${m[2]}` : 'JSS1';
      const regex = new RegExp(`^ANA\/${code}\/(\\d{3})([a-z])?$`, 'i');

      let maxNum = 0;
      studentList.forEach((st) => {
        const match = (st.admission_number || '').match(regex);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });

      const nextNum = maxNum + 1;
      const padded = String(nextNum).padStart(3, '0');
      const letter = String.fromCharCode(97 + ((nextNum - 1) % 26));
      return `ANA/${code}/${padded}${letter}`;
    }
    return '';
  }, [classes, students]);

  async function load(preserveClassId = null) {
    const [studentRows, classRows] = await Promise.all([api('/students'), api('/classes')]);
    setStudents(studentRows);
    setClasses(classRows);
    setBulkClassId((current) => current || classRows[0]?.id || '');

    const targetClassId = preserveClassId || form.class_id || classRows[0]?.id || '';
    if (!editingId && targetClassId) {
      const nextAdm = await fetchNextAdmissionNumber(targetClassId, classRows, studentRows);
      setForm((current) => ({
        ...current,
        class_id: targetClassId,
        admission_number: current.admission_number || nextAdm
      }));
    } else {
      setForm((current) => ({ ...current, class_id: targetClassId }));
    }
  }

  useEffect(() => {
    load().catch((err) => setMessage(err.message));
  }, []);

  // When class changes, auto-generate admission number based on new class
  const handleClassChange = async (newClassId) => {
    setForm((cur) => ({ ...cur, class_id: newClassId }));
    if (!editingId) {
      setGeneratingAdm(true);
      const nextAdm = await fetchNextAdmissionNumber(newClassId);
      if (nextAdm) {
        setForm((cur) => ({ ...cur, class_id: newClassId, admission_number: nextAdm }));
      }
      setGeneratingAdm(false);
    }
  };

  const handleRegenerateAdmission = async () => {
    if (!form.class_id) return;
    setGeneratingAdm(true);
    const nextAdm = await fetchNextAdmissionNumber(form.class_id);
    if (nextAdm) {
      setForm((cur) => ({ ...cur, admission_number: nextAdm }));
      setMessage(`Generated admission number ${nextAdm} for selected class.`);
    }
    setGeneratingAdm(false);
  };

  function chooseFile(file) {
    setPassport(file);
    setPreview(file ? URL.createObjectURL(file) : '');
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      const data = new FormData();
      const payload = {
        ...form,
        admission_number: normalizeAdmissionNumber(form.admission_number),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim()
      };
      Object.entries(payload).forEach(([key, value]) => data.append(key, value));
      if (passport) data.append('passport', passport);
      if (editingId) {
        await api(`/students/${editingId}`, { method: 'PUT', body: data });
      } else {
        await api('/students', { method: 'POST', body: data });
      }

      const currentClassId = form.class_id || classes[0]?.id || '';
      setPassport(null);
      setPreview('');
      setMessage(editingId ? 'Student updated successfully' : 'Student added successfully');
      setEditingId(null);

      // Reload students and auto-generate next admission number for current class
      const [studentRows] = await Promise.all([api('/students')]);
      setStudents(studentRows);
      const nextAdm = await fetchNextAdmissionNumber(currentClassId, classes, studentRows);
      setForm({ ...blank, class_id: currentClassId, admission_number: nextAdm });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this student record?')) return;
    await api(`/students/${id}`, { method: 'DELETE' });
    await load(form.class_id);
  }

  async function edit(id) {
    setMessage('');
    try {
      const data = await api(`/students/${id}`);
      setForm({
        admission_number: data.admission_number || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        gender: data.gender || 'Male',
        class_id: data.class_id || ''
      });
      setPreview(data.passport_path ? assetUrl(data.passport_path) : '');
      setPassport(null);
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage(err.message || 'Unable to load student');
    }
  }

  async function cancelEdit() {
    setEditingId(null);
    setPassport(null);
    setPreview('');
    setMessage('');
    const targetClassId = form.class_id || classes[0]?.id || '';
    const nextAdm = await fetchNextAdmissionNumber(targetClassId);
    setForm({ ...blank, class_id: targetClassId, admission_number: nextAdm });
  }

  async function deletePassportAction() {
    if (!editingId) return;
    if (!confirm('Remove passport image for this student?')) return;
    try {
      await api(`/students/${editingId}/passport`, { method: 'DELETE' });
      setPreview('');
      setMessage('Passport removed');
    } catch (err) {
      setMessage(err.message || 'Unable to remove passport');
    }
  }

  function downloadStudentTemplate() {
    const headers = 'first_name,last_name,admission_number,class,gender,date_of_birth,parent_name,parent_phone,parent_email';
    const blob = new Blob([`${headers}\r\n`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_upload_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function importStudents() {
    if (!csvFile) {
      setCsvMessage('Choose a CSV file first.');
      return;
    }

    setCsvMessage('');
    setImportingCsv(true);
    try {
      const data = new FormData();
      data.append('csvFile', csvFile);
      if (bulkClassId) data.append('classId', bulkClassId);
      const result = await api('/students/upload-csv', { method: 'POST', body: data });
      setCsvMessage(result.message);
      setCsvFile(null);
      if (csvInputRef.current) csvInputRef.current.value = '';
      try {
        await load(form.class_id);
      } catch (error) {
        setCsvMessage(`${result.message} The import succeeded, but the student list could not refresh: ${error.message}`);
      }
    } catch (error) {
      setCsvMessage(error.message);
    } finally {
      setImportingCsv(false);
    }
  }

  const selectedClassObj = classes.find((c) => c.id === form.class_id);

  return (
    <section>
      <header className="mb-5 flex items-start justify-between gap-4 max-[760px]:grid">
        <div>
          <h1>Students</h1>
          <p>Add and manage learners. Admission numbers are automatically generated based on the selected class.</p>
        </div>
      </header>
      <section className={`${panel} mb-[18px]`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="mt-1 text-primary" size={22} />
            <div>
              <h2>Import Students from CSV</h2>
              <p className="mt-1 text-sm text-slate-600">
                Import student details in one upload. Admission numbers are generated when omitted and are used to match later result uploads.
              </p>
            </div>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-[7px] border border-line px-3 py-2 text-sm font-semibold" onClick={downloadStudentTemplate}>
            <Download size={16} /> Download template
          </button>
        </div>
        <div className="mt-4 grid grid-cols-[minmax(180px,1fr)_minmax(220px,2fr)_auto] items-end gap-3 max-[760px]:grid-cols-1">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">Default class (used when CSV class is blank)</label>
            <select value={bulkClassId} onChange={(event) => setBulkClassId(event.target.value)} disabled={!classes.length}>
              {classes.map((item) => <option key={item.id} value={item.id}>{item.class_name}</option>)}
            </select>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600">Student CSV file</span>
            <input ref={csvInputRef} className="w-full" type="file" accept=".csv,text/csv" onChange={(event) => setCsvFile(event.target.files[0] || null)} />
          </label>
          <button type="button" className={`${primaryButton} disabled:cursor-not-allowed disabled:opacity-70`} onClick={importStudents} disabled={importingCsv || !classes.length}>
            <Upload size={17} /> {importingCsv ? 'Importing...' : 'Upload students'}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Required columns: first_name and last_name, or student_name; include class per row or use the selected default. Upload results separately from Results using the generated admission numbers.
        </p>
        {csvMessage && <p className="mt-3 font-bold text-primary-dark" role="status">{csvMessage}</p>}
      </section>
      <div className="grid min-w-0 grid-cols-[minmax(310px,420px)_1fr] gap-[18px] max-[1040px]:grid-cols-1">
        <form className={`${panel} ${formGrid} content-start`} onSubmit={submit}>
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2>{editingId ? 'Edit Student' : 'Add Student'}</h2>
            <span className="rounded bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 flex items-center gap-1">
              <Sparkles size={13} /> Class-Based Admission
            </span>
          </div>

          {/* Class Selection (First, so admission number generates based on it) */}
          <div className={twoGrid}>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">Class</label>
              <select
                required
                value={form.class_id}
                onChange={(e) => handleClassChange(e.target.value)}
              >
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.class_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          {/* Admission Number (Auto-generated with manual override and regenerate button) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-600">
                Admission Number
              </label>
              <button
                type="button"
                onClick={handleRegenerateAdmission}
                disabled={generatingAdm || !form.class_id}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                title="Regenerate next number for selected class"
              >
                <RefreshCw size={12} className={generatingAdm ? 'animate-spin' : ''} />
                Regenerate for {selectedClassObj?.class_name || 'Class'}
              </button>
            </div>
            <div className="relative">
              <input
                placeholder="e.g. ANA/JSS2/001a"
                required
                pattern="[Aa][Nn][Aa]\/(?:[Jj][Ss][Ss]|[Ss][Ss])[1-3]\/[0-9]{3}[a-zA-Z]"
                title="Use the format ANA/JSS1/001a or ANA/JSS2/001a"
                value={form.admission_number}
                onChange={(e) => setForm({ ...form, admission_number: e.target.value })}
                onBlur={(e) => setForm({ ...form, admission_number: normalizeAdmissionNumber(e.target.value) })}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              ✨ Auto-generated based on <strong>{selectedClassObj?.class_name || 'selected class'}</strong>.
            </p>
          </div>

          {/* First Name & Last Name */}
          <div className={twoGrid}>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">First Name</label>
              <input
                placeholder="e.g. Bashar"
                required
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">Last Name</label>
              <input
                placeholder="e.g. Atofarati"
                required
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </div>
          </div>

          {/* Passport Upload */}
          <label className="grid grid-cols-[auto_1fr] place-items-center rounded-lg border border-dashed border-line p-3 cursor-pointer hover:bg-slate-50">
            <Upload size={18} />
            <span className="text-xs font-semibold">Upload passport photograph</span>
            <input className="hidden" type="file" accept="image/png,image/jpeg" onChange={(e) => chooseFile(e.target.files[0])} />
          </label>
          {preview && (
            <div className="flex items-start gap-3">
              <img className="h-24 w-24 rounded-lg border border-line object-cover" src={preview} alt="Passport preview" />
              {editingId && (
                <div className="flex flex-col gap-2">
                  <button type="button" className="rounded-[7px] border px-3 py-2 text-sm" onClick={deletePassportAction}>
                    Remove passport
                  </button>
                </div>
              )}
            </div>
          )}

          {message && <p className="m-0 font-bold text-primary-dark">{message}</p>}

          <div className="flex items-center gap-2 pt-1">
            <button className={`${primaryButton} disabled:cursor-not-allowed disabled:opacity-70`} type="submit" disabled={saving || !classes.length}>
              <Plus size={18} /> {saving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Student' : 'Save Student')}
            </button>
            {editingId && (
              <button type="button" className="rounded-[7px] border px-4 py-[11px] cursor-pointer" onClick={cancelEdit} disabled={saving}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className={panel}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3.5 max-[760px]:grid">
            <h2>Student Records ({filtered.length})</h2>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex min-w-[180px] items-center gap-2">
                <span className="whitespace-nowrap text-xs font-bold text-slate-600">Class</span>
                <select value={recordClassId} onChange={(event) => setRecordClassId(event.target.value)}>
                  <option value="">All classes</option>
                  {classes.map((item) => <option key={item.id} value={item.id}>{item.class_name}</option>)}
                </select>
              </label>
              <div className="flex flex-nowrap items-center gap-2">
                <label className="flex min-w-[150px] items-center gap-2">
                  <span className="whitespace-nowrap text-xs font-bold text-slate-600">Gender</span>
                  <select value={recordGender} onChange={(event) => setRecordGender(event.target.value)}>
                    <option value="">All students</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </label>
                <label className="flex w-[220px] shrink-0 items-center gap-2 rounded-[7px] border border-line pl-2.5">
                  <Search size={17} />
                  <input className="min-w-0 border-0 focus:ring-0" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                </label>
              </div>
            </div>
          </div>
          <div className="mb-3 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 sm:hidden">
            Swipe horizontally to see all columns on mobile.
          </div>
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Passport</th>
                  <th>Admission No</th>
                  <th>Full Name</th>
                  <th>Class</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Passport">
                      {item.passport_path ? (
                        <img className="h-9 w-9 rounded-full object-cover" src={assetUrl(item.passport_path)} alt={item.first_name} />
                      ) : (
                        <span className="inline-grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {(item.first_name || '').charAt(0)}{(item.last_name || '').charAt(0)}
                        </span>
                      )}
                    </td>
                    <td data-label="Admission No" className="font-bold text-ink">
                      {item.admission_number}
                    </td>
                    <td data-label="Full Name">
                      {item.first_name} {item.last_name}
                    </td>
                    <td data-label="Class">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {item.class_name || 'N/A'}
                      </span>
                    </td>
                    <td data-label="Gender">{item.gender}</td>
                    <td data-label="Actions">
                      <div className="flex items-center gap-2">
                        <button type="button" className={iconButton} onClick={() => edit(item.id)} title="Edit student">
                          <Edit size={16} />
                        </button>
                        <button type="button" className={iconButton} onClick={() => remove(item.id)} title="Delete student">
                          <Trash2 size={16} className="text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <EmptyState message={recordGender ? `No ${recordGender.toLowerCase()} students found matching your filters.` : recordClassId ? 'No students found in this class matching your search.' : 'No students found matching your search.'} />}
          </div>
        </section>
      </div>
    </section>
  );
}
