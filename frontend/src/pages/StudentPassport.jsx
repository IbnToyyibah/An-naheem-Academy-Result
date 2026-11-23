import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserRound, Upload } from 'lucide-react';
import { api } from '../services/api.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function StudentPassport() {
  const [fullName, setFullName] = useState('');
  const [classId, setClassId] = useState('');
  const [gender, setGender] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [classes, setClasses] = useState([]);
  const [classLoadError, setClassLoadError] = useState('');
  const [passport, setPassport] = useState(null);
  const [passportPreview, setPassportPreview] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;
    api('/public/classes', { authRedirect: false })
      .then((items) => {
        if (active) setClasses(items);
      })
      .catch((error) => {
        if (active) setClassLoadError(error.message || 'Unable to load classes.');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!passport) {
      setPassportPreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(passport);
    setPassportPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [passport]);

  function choosePassport(event) {
    const file = event.target.files?.[0] || null;
    setMessage('');
    setSuccess(false);

    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      setPassport(null);
      event.target.value = '';
      setMessage('Choose a JPG or PNG image.');
      return;
    }
    if (file && file.size > MAX_FILE_SIZE) {
      setPassport(null);
      event.target.value = '';
      setMessage('The passport image must be 2 MB or smaller.');
      return;
    }

    setPassport(file);
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    if (!passport) {
      setMessage('Choose a JPG or PNG passport image.');
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('classId', classId);
      formData.append('gender', gender);
      formData.append('admissionNumber', admissionNumber.trim());
      formData.append('passport', passport);
      const result = await api('/public/student-passport', {
        method: 'POST',
        body: formData,
        authRedirect: false
      });
      setSuccess(true);
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message || 'Unable to upload the passport photo.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:underline">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <img
            src="/Annaheem.jpeg.png"
            alt="An-Naheem Academy logo"
            className="h-12 w-12 object-contain"
          />
        </div>

        <div className="mb-6 flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-900">
            <UserRound size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Student BIODATA</h1>
            <p className="mt-1 text-sm text-slate-600">
              Complete the student details and add a passport photo.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Student ID
            <input
              required
              value={admissionNumber}
              onChange={(event) => setAdmissionNumber(event.target.value)}
              placeholder="ANA/JSS1/001"
              autoComplete="off"
              className="rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Full Name
            <input
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Student’s full name"
              autoComplete="name"
              className="rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Class
            <select
              required
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
              disabled={!classes.length}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 disabled:bg-slate-100"
            >
              <option value="">{classLoadError ? 'Classes unavailable' : 'Select class'}</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>{item.class_name}</option>
              ))}
            </select>
            {classLoadError && <span className="text-xs font-normal text-red-600">{classLoadError}</span>}
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Gender
            <select
              required
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Student Passport
            <input
              required
              type="file"
              accept="image/jpeg,image/png"
              onChange={choosePassport}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
            <span className="text-xs font-normal text-slate-500">JPG or PNG, maximum 2 MB.</span>
          </label>

          {passportPreview && (
            <div className="grid justify-items-start gap-2">
              <span className="text-sm font-semibold text-slate-700">Passport preview</span>
              <img
                src={passportPreview}
                alt="Preview of the student passport"
                className="h-36 w-36 rounded-xl border border-slate-200 bg-slate-50 object-cover"
              />
            </div>
          )}

          {message && (
            <p className={`m-0 rounded-lg px-3 py-2 text-sm font-semibold ${success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`} role="status">
              {message}
            </p>
          )}

          <p className="m-0 text-xs leading-relaxed text-slate-500">
            The saved photo will appear on the student result.
          </p>

          <button
            type="submit"
            disabled={uploading || success || !classes.length}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={17} />
            {uploading ? 'Submitting...' : success ? 'BIODATA submitted' : 'Submit BIODATA'}
          </button>
        </form>
      </section>
    </main>
  );
}
