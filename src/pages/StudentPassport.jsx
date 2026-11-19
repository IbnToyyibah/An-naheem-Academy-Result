import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Upload } from 'lucide-react';
import { api } from '../services/api.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function StudentPassport() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [passport, setPassport] = useState(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      setMessage('Choose a JPG or PNG passport image to upload.');
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
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
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:underline">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="mb-6 flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-900">
            <ImagePlus size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Upload Student Passport</h1>
            <p className="mt-1 text-sm text-slate-600">
              Enter the student’s ID to link the photo to their record.
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
              placeholder="ANA/JSS1/001a"
              autoComplete="off"
              className="rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Passport photo
            <input
              required
              type="file"
              accept="image/jpeg,image/png"
              onChange={choosePassport}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
            <span className="text-xs font-normal text-slate-500">JPG or PNG, maximum 2 MB.</span>
          </label>

          {message && (
            <p className={`m-0 rounded-lg px-3 py-2 text-sm font-semibold ${success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`} role="status">
              {message}
            </p>
          )}

          <p className="m-0 text-xs leading-relaxed text-slate-500">
            The uploaded photo is attached to the verified student record and will be shown on their result.
          </p>

          <button
            type="submit"
            disabled={uploading || success}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={17} />
            {uploading ? 'Uploading...' : success ? 'Passport uploaded' : 'Upload Passport'}
          </button>
        </form>
      </section>
    </main>
  );
}
