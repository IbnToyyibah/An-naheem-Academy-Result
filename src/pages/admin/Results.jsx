import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
  Edit3,
  Save,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  RefreshCw,
  UserCheck,
  Info,
  X
} from 'lucide-react';
import { api } from '../../services/api.js';
import {
  parseCsvRows,
  buildCsvTemplateContent,
  downloadCsvFile
} from '../../utils/csv.js';

const panel = 'min-w-0 rounded-lg border border-line bg-panel p-[18px] shadow-panel max-[520px]:p-3.5';
const formGrid = 'grid gap-3.5';
const primaryButton = 'flex items-center justify-center gap-2 rounded-[7px] border-0 bg-primary px-4 py-[11px] font-extrabold text-white transition hover:bg-primary-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
const secondaryButton = 'flex items-center justify-center gap-2 rounded-[7px] border border-line bg-surface px-4 py-[10px] font-bold text-ink transition hover:bg-slate-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

export default function Results() {
  const [activeTab, setActiveTab] = useState('csv'); // 'csv' | 'manual'
  const [lookups, setLookups] = useState({ students: [], subjects: [], sessions: [], terms: [], classes: [] });
  const [filters, setFilters] = useState({ studentId: '', sessionId: '', termId: '', attendance: '', principalRemark: '' });
  const [scores, setScores] = useState({});
  const [message, setMessage] = useState('');
  const [loadingSavedResults, setLoadingSavedResults] = useState(false);
  const [hasSavedResults, setHasSavedResults] = useState(false);
  const [saving, setSaving] = useState(false);

  // CSV Upload States
  const [csvFile, setCsvFile] = useState(null);
  const [csvText, setCsvText] = useState('');
  const [csvParsed, setCsvParsed] = useState({ entries: [], errors: [] });
  const [csvSessionId, setCsvSessionId] = useState('');
  const [csvTermId, setCsvTermId] = useState('');
  const [csvClassFilter, setCsvClassFilter] = useState('all');
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvSuccessResult, setCsvSuccessResult] = useState(null);
  const [csvErrorMessage, setCsvErrorMessage] = useState('');
  const [showPreviewTable, setShowPreviewTable] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api('/students'),
      api('/subjects'),
      api('/sessions'),
      api('/terms'),
      api('/classes').catch(() => [])
    ])
      .then(([students, subjects, sessions, terms, classes]) => {
        const currentSession = sessions.find((s) => s.is_current) || sessions[0];
        const currentTerm = terms.find((t) => t.is_current) || terms[0];

        setLookups({ students, subjects, sessions, terms, classes });
        setFilters({
          studentId: students[0]?.id || '',
          sessionId: currentSession?.id || '',
          termId: currentTerm?.id || '',
          attendance: '',
          principalRemark: ''
        });
        setCsvSessionId(currentSession?.id || '');
        setCsvTermId(currentTerm?.id || '');
      })
      .catch((err) => {
        setMessage(err.message || 'Unable to load students, subjects, sessions, and terms.');
      });
  }, []);

  const normalizeSubjectId = (id) => {
    if (!id) return null;
    return typeof id === 'object' && id.id ? id.id : String(id);
  };

  const requestIdRef = useRef(0);

  const loadSavedResults = useCallback(async (studentId, sessionId, termId, subjects, { silent = false } = {}) => {
    if (!studentId || !sessionId || !termId || !subjects.length) return;

    if (!silent) setLoadingSavedResults(true);
    const currentId = ++requestIdRef.current;
    try {
      const rows = await api(`/results/student/${studentId}?sessionId=${sessionId}&termId=${termId}`);
      if (currentId !== requestIdRef.current) return;

      const nextScores = {};
      rows.forEach((row) => {
        const subjectId = normalizeSubjectId(row.subject_id)
          || normalizeSubjectId(subjects.find((s) => s.subject_name === row.subject_name)?.id);
        if (!subjectId) return;
        nextScores[subjectId] = {
          firstCa: row.first_ca ?? '',
          secondCa: row.second_ca ?? '',
          exam: row.exam ?? ''
        };
      });

      setScores(nextScores);
      setHasSavedResults(rows.length > 0);
      setFilters((current) => ({
        ...current,
        attendance: rows[0]?.attendance ?? '',
        principalRemark: rows[0]?.principal_remark ?? ''
      }));
      if (!silent) {
        setMessage(rows.length
          ? 'Loaded saved results for selected student. You can edit and save changes.'
          : 'No saved results found for this selection.');
      }
    } catch (err) {
      if (!silent) {
        setHasSavedResults(false);
        setScores({});
        setMessage(err.message || 'Unable to load saved results.');
      }
    } finally {
      if (!silent) setLoadingSavedResults(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'manual') {
      loadSavedResults(filters.studentId, filters.sessionId, filters.termId, lookups.subjects);
    }
  }, [filters.studentId, filters.sessionId, filters.termId, lookups.subjects, activeTab, loadSavedResults]);

  const totals = useMemo(() => {
    return Object.fromEntries(Object.entries(scores).map(([subjectId, row]) => {
      const total = Number(row.firstCa || 0) + Number(row.secondCa || 0) + Number(row.exam || 0);
      return [subjectId, total];
    }));
  }, [scores]);

  function updateScore(subjectId, key, value) {
    setScores((current) => ({
      ...current,
      [subjectId]: { ...current[subjectId], [key]: value }
    }));
  }

  // -------------------------------------------------------------
  // Manual submission handler
  // -------------------------------------------------------------
  async function submitManual(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    const existingRows = await api(`/results/student/${filters.studentId}?sessionId=${filters.sessionId}&termId=${filters.termId}`).catch(() => []);
    const existingMap = {};
    existingRows.forEach((row) => {
      const sid = row.subject_id?.id || row.subject_id || lookups.subjects.find((s) => s.subject_name === row.subject_name)?.id;
      if (sid) {
        existingMap[sid] = {
          firstCa: row.first_ca ?? 0,
          secondCa: row.second_ca ?? 0,
          exam: row.exam ?? 0
        };
      }
    });

    const existingAttendance = existingRows[0]?.attendance ?? '';
    const existingPrincipal = existingRows[0]?.principal_remark ?? '';
    const payload = {
      ...filters,
      attendance: filters.attendance !== '' ? filters.attendance : existingAttendance,
      principalRemark: filters.principalRemark !== '' ? filters.principalRemark : existingPrincipal,
      scores: lookups.subjects
        .filter((subject) => {
          const sid = subject.id;
          const input = scores[sid] || {};
          const existing = existingMap[sid] || {};
          const hasInput =
            (input.firstCa !== undefined && input.firstCa !== '') ||
            (input.secondCa !== undefined && input.secondCa !== '') ||
            (input.exam !== undefined && input.exam !== '');
          const hasExisting = existing.firstCa != null || existing.secondCa != null || existing.exam != null;
          return hasInput || hasExisting;
        })
        .map((subject) => {
          const sid = subject.id;
          const input = scores[sid] || {};
          const existing = existingMap[sid] || {};
          return {
            subjectId: sid,
            firstCa: input.firstCa !== undefined && input.firstCa !== '' ? Number(input.firstCa) : existing.firstCa,
            secondCa: input.secondCa !== undefined && input.secondCa !== '' ? Number(input.secondCa) : existing.secondCa,
            exam: input.exam !== undefined && input.exam !== '' ? Number(input.exam) : existing.exam
          };
        })
    };

    try {
      await api('/results/bulk', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Results saved successfully');
      setHasSavedResults(true);
      await loadSavedResults(filters.studentId, filters.sessionId, filters.termId, lookups.subjects, { silent: true });
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to save results');
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------------------------------------
  // CSV Template Download
  // -------------------------------------------------------------
  const handleDownloadTemplate = (includeStudents = true) => {
    try {
      let filteredStudents = lookups.students;
      if (includeStudents && csvClassFilter !== 'all') {
        filteredStudents = lookups.students.filter(
          (s) => s.class_id === csvClassFilter || s.class_name === csvClassFilter || s.class_id?.id === csvClassFilter
        );
      }

      const csvContent = buildCsvTemplateContent({
        students: filteredStudents,
        subjects: lookups.subjects,
        includeStudents
      });

      const sessionObj = lookups.sessions.find((s) => s.id === csvSessionId);
      const termObj = lookups.terms.find((t) => t.id === csvTermId);
      const cleanSession = (sessionObj?.session_name || 'session').replace(/[^a-zA-Z0-9]/g, '_');
      const cleanTerm = (termObj?.term_name || 'term').replace(/[^a-zA-Z0-9]/g, '_');

      const filename = includeStudents
        ? `results_template_${cleanSession}_${cleanTerm}.csv`
        : 'results_sample_template.csv';

      downloadCsvFile(csvContent, filename);
    } catch (err) {
      setCsvErrorMessage(err.message || 'Failed to generate CSV template');
    }
  };

  // -------------------------------------------------------------
  // CSV File Selection & Client-Side Parse
  // -------------------------------------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvErrorMessage('Please select a valid .csv file');
      return;
    }

    setCsvFile(file);
    setCsvErrorMessage('');
    setCsvSuccessResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result || '';
        setCsvText(text);
        const { entries, errors } = parseCsvRows(text);
        setCsvParsed({ entries, errors });
      } catch (err) {
        setCsvErrorMessage(err.message || 'Error parsing CSV file');
        setCsvParsed({ entries: [], errors: [{ row: 1, message: err.message }] });
      }
    };
    reader.readAsText(file);
  };

  const handleClearCsv = () => {
    setCsvFile(null);
    setCsvText('');
    setCsvParsed({ entries: [], errors: [] });
    setCsvErrorMessage('');
    setCsvSuccessResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Distinct students detected in parsed CSV
  const distinctStudentsCount = useMemo(() => {
    const set = new Set();
    csvParsed.entries.forEach((e) => {
      if (e.admissionNumber) set.add(e.admissionNumber.toUpperCase().trim());
    });
    return set.size;
  }, [csvParsed.entries]);

  // Distinct subjects detected in parsed CSV
  const distinctSubjectsCount = useMemo(() => {
    const set = new Set();
    csvParsed.entries.forEach((e) => {
      if (e.subject) set.add(e.subject.toLowerCase().trim());
    });
    return set.size;
  }, [csvParsed.entries]);

  // Validate scores client-side
  const scoreValidationErrors = useMemo(() => {
    const issues = [];
    csvParsed.entries.forEach((entry) => {
      if (entry.firstCa < 0 || entry.firstCa > 20) {
        issues.push(`Row ${entry.rowNumber}: 1st CA score (${entry.firstCa}) must be between 0 and 20`);
      }
      if (entry.secondCa < 0 || entry.secondCa > 20) {
        issues.push(`Row ${entry.rowNumber}: 2nd CA score (${entry.secondCa}) must be between 0 and 20`);
      }
      if (entry.exam < 0 || entry.exam > 60) {
        issues.push(`Row ${entry.rowNumber}: Exam score (${entry.exam}) must be between 0 and 60`);
      }
      if (entry.attendance !== null && (isNaN(entry.attendance) || entry.attendance < 0)) {
        issues.push(`Row ${entry.rowNumber}: Attendance must be a non-negative number`);
      }
    });
    return issues;
  }, [csvParsed.entries]);

  // -------------------------------------------------------------
  // Submit CSV Upload to Backend
  // -------------------------------------------------------------
  const handleUploadCsv = async () => {
    if (!csvFile && !csvText) {
      setCsvErrorMessage('Please select a CSV file first');
      return;
    }

    if (csvParsed.errors.length > 0 || scoreValidationErrors.length > 0) {
      setCsvErrorMessage('Please correct the validation errors before uploading.');
      return;
    }

    setCsvUploading(true);
    setCsvErrorMessage('');
    setCsvSuccessResult(null);

    try {
      const formData = new FormData();
      if (csvFile) {
        formData.append('csvFile', csvFile);
      } else {
        formData.append('csvText', csvText);
      }
      formData.append('sessionId', csvSessionId);
      formData.append('termId', csvTermId);

      const result = await api('/results/upload-csv', {
        method: 'POST',
        body: formData
      });

      setCsvSuccessResult(result);
      // Refresh students and lookups in case new data is present
      const refreshedStudents = await api('/students').catch(() => lookups.students);
      setLookups((cur) => ({ ...cur, students: refreshedStudents }));

      // Clear the file input so it can be used again
      setCsvFile(null);
      setCsvText('');
      setCsvParsed({ entries: [], errors: [] });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      setCsvErrorMessage(err.message || 'CSV upload failed');
    } finally {
      setCsvUploading(false);
    }
  };

  // Inspect student in manual mode
  const handleInspectStudent = (studentId) => {
    setFilters((cur) => ({
      ...cur,
      studentId: studentId || cur.studentId,
      sessionId: csvSessionId || cur.sessionId,
      termId: csvTermId || cur.termId
    }));
    setActiveTab('manual');
  };

  return (
    <section className="space-y-6">
      {/* Top Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink">Result Management</h1>
          <p className="text-sm text-slate-500">
            Upload results for individual students in bulk via CSV or enter them manually.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-lg border border-line bg-surface p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('csv')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'csv'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <FileSpreadsheet size={16} />
            Bulk CSV Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'manual'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <Edit3 size={16} />
            Single Student Entry
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* TAB 1: CSV BULK UPLOAD                                     */}
      {/* ========================================================= */}
      {activeTab === 'csv' && (
        <div className="space-y-6">
          {/* Card 1: Configuration & Template Download */}
          <div className={`${panel} space-y-5 bg-white`}>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Download className="text-primary" size={20} />
                <h2 className="text-base font-bold text-ink">Step 1: Download CSV Template</h2>
              </div>
              <span className="rounded bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
                Individual Student Compatible
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Select the academic session, term, and optional class. Then download the CSV template pre-filled with your
              enrolled students or download a clean sample template. Open in Excel, enter the CA and Exam scores, save, and upload.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">Academic Session</label>
                <select
                  value={csvSessionId}
                  onChange={(e) => setCsvSessionId(e.target.value)}
                  className="w-full"
                >
                  {lookups.sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.session_name} {s.is_current ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">Term</label>
                <select
                  value={csvTermId}
                  onChange={(e) => setCsvTermId(e.target.value)}
                  className="w-full"
                >
                  {lookups.terms.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.term_name} {t.is_current ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">Class Filter (Optional)</label>
                <select
                  value={csvClassFilter}
                  onChange={(e) => setCsvClassFilter(e.target.value)}
                  className="w-full"
                >
                  <option value="all">All Classes ({lookups.students.length} students)</option>
                  {lookups.classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.class_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadTemplate(true)}
                className={primaryButton}
              >
                <Download size={16} />
                Download Template (With Enrolled Students)
              </button>

              <button
                type="button"
                onClick={() => handleDownloadTemplate(false)}
                className={secondaryButton}
              >
                <FileText size={16} />
                Download Blank Sample CSV
              </button>
            </div>

            {/* Quick Scoring Guidelines */}
            <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-3.5 text-xs text-sky-900">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Info size={15} />
                <span>Score Rules & Grading Scale</span>
              </div>
              <p className="leading-relaxed">
                <strong>1st CA:</strong> 0 - 20 &bull; <strong>2nd CA:</strong> 0 - 20 &bull; <strong>Exam:</strong> 0 - 60 &bull; <strong>Total:</strong> 0 - 100.
                <br />
                Grades: <strong>A</strong> (&ge;70), <strong>B</strong> (&ge;60), <strong>C</strong> (&ge;50), <strong>D</strong> (&ge;45), <strong>E</strong> (&ge;40), <strong>F</strong> (&lt;40).
                Attendance and Principal Remark are optional per student.
              </p>
            </div>
          </div>

          {/* Card 2: Upload CSV File */}
          <div className={`${panel} space-y-5 bg-white`}>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Upload className="text-primary" size={20} />
                <h2 className="text-base font-bold text-ink">Step 2: Upload Completed CSV</h2>
              </div>
              {csvFile && (
                <button
                  type="button"
                  onClick={handleClearCsv}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800"
                >
                  <X size={14} /> Clear File
                </button>
              )}
            </div>

            {/* Dropzone / File Picker */}
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition hover:border-primary hover:bg-slate-50">
              <FileSpreadsheet className="mb-2 text-primary/70" size={36} />
              <p className="text-sm font-bold text-ink">Choose a CSV file or drag and drop here</p>
              <p className="mt-1 text-xs text-slate-500">Only standard comma-separated .csv files are supported</p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel"
                onChange={handleFileChange}
                className="mt-4 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-primary-dark cursor-pointer"
              />
            </div>

            {/* File Info & Statistics Bar */}
            {csvFile && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet size={16} className="text-primary" />
                  <span className="font-bold text-ink">{csvFile.name}</span>
                  <span className="text-slate-400">({(csvFile.size / 1024).toFixed(1)} KB)</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded bg-slate-200 px-2 py-0.5 font-bold text-slate-700">
                    {distinctStudentsCount} Individual Student{distinctStudentsCount === 1 ? '' : 's'}
                  </span>
                  <span className="rounded bg-slate-200 px-2 py-0.5 font-bold text-slate-700">
                    {csvParsed.entries.length} Subject Scores
                  </span>
                  <span className="rounded bg-slate-200 px-2 py-0.5 font-bold text-slate-700">
                    {distinctSubjectsCount} Subjects
                  </span>
                </div>
              </div>
            )}

            {/* Validation Feedback */}
            {csvParsed.errors.length > 0 && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
                <div className="flex items-center gap-2 font-bold mb-1.5 text-rose-900">
                  <AlertCircle size={16} />
                  <span>Found {csvParsed.errors.length} formatting issue(s) in CSV:</span>
                </div>
                <ul className="list-inside list-disc space-y-1">
                  {csvParsed.errors.slice(0, 10).map((err, i) => (
                    <li key={i}>{typeof err === 'string' ? err : `Row ${err.row}: ${err.message}`}</li>
                  ))}
                </ul>
              </div>
            )}

            {scoreValidationErrors.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
                <div className="flex items-center gap-2 font-bold mb-1.5 text-amber-900">
                  <AlertTriangle size={16} />
                  <span>Found {scoreValidationErrors.length} score value warning(s):</span>
                </div>
                <ul className="list-inside list-disc space-y-1">
                  {scoreValidationErrors.slice(0, 10).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* General Error Message */}
            {csvErrorMessage && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-700">
                {csvErrorMessage}
              </div>
            )}

            {/* Upload Button */}
            {csvParsed.entries.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleUploadCsv}
                  disabled={csvUploading || csvParsed.errors.length > 0 || scoreValidationErrors.length > 0}
                  className={primaryButton}
                >
                  <Upload size={16} />
                  {csvUploading ? 'Uploading & Processing Results...' : `Upload Results for ${distinctStudentsCount} Student(s)`}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreviewTable(!showPreviewTable)}
                  className={secondaryButton}
                >
                  {showPreviewTable ? 'Hide Preview' : 'Show Preview'} ({csvParsed.entries.length} rows)
                </button>
              </div>
            )}

            {/* Parsed Rows Preview Table */}
            {showPreviewTable && csvParsed.entries.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Previewing Parsed Records (First {Math.min(15, csvParsed.entries.length)} of {csvParsed.entries.length} rows)
                </h3>
                <div className="responsive-table max-h-80 overflow-y-auto rounded-lg border border-line">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Admission No</th>
                        <th>Subject</th>
                        <th>1st CA (20)</th>
                        <th>2nd CA (20)</th>
                        <th>Exam (60)</th>
                        <th>Total</th>
                        <th>Attendance</th>
                        <th>Principal Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvParsed.entries.slice(0, 15).map((entry, idx) => {
                        const rowTotal = Number(entry.firstCa || 0) + Number(entry.secondCa || 0) + Number(entry.exam || 0);
                        return (
                          <tr key={idx}>
                            <td data-label="#">{entry.rowNumber || idx + 1}</td>
                            <td data-label="Admission No" className="font-bold text-ink">
                              {entry.admissionNumber}
                            </td>
                            <td data-label="Subject">{entry.subject}</td>
                            <td data-label="1st CA">{entry.firstCa}</td>
                            <td data-label="2nd CA">{entry.secondCa}</td>
                            <td data-label="Exam">{entry.exam}</td>
                            <td data-label="Total" className="font-extrabold text-primary">
                              {rowTotal}
                            </td>
                            <td data-label="Attendance">{entry.attendance ?? '-'}</td>
                            <td data-label="Remark" className="truncate max-w-[180px]">
                              {entry.principalRemark || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Success Banner Card */}
          {csvSuccessResult && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-emerald-600 flex-shrink-0" size={24} />
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-950">
                      Results Uploaded Successfully!
                    </h3>
                    <p className="text-xs font-medium text-emerald-800 mt-0.5">
                      {csvSuccessResult.message}
                    </p>
                  </div>

                  {/* Summary Pills */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-md bg-emerald-100 px-2.5 py-1 font-bold text-emerald-900">
                      👥 {csvSuccessResult.studentsCount} Students Updated
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2.5 py-1 font-bold text-emerald-900">
                      📚 {csvSuccessResult.resultsCount} Subject Records Saved
                    </span>
                    {csvSuccessResult.sessionName && (
                      <span className="rounded-md bg-emerald-100 px-2.5 py-1 font-bold text-emerald-900">
                        Session: {csvSuccessResult.sessionName}
                      </span>
                    )}
                    {csvSuccessResult.termName && (
                      <span className="rounded-md bg-emerald-100 px-2.5 py-1 font-bold text-emerald-900">
                        Term: {csvSuccessResult.termName}
                      </span>
                    )}
                  </div>

                  {/* List of Updated Individual Students */}
                  {csvSuccessResult.students && csvSuccessResult.students.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-emerald-200/60">
                      <p className="text-xs font-bold text-emerald-900">Updated Individual Students:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {csvSuccessResult.students.map((st) => (
                          <div
                            key={st.id}
                            className="flex items-center justify-between rounded bg-white/90 px-3 py-1.5 text-xs border border-emerald-100 shadow-xs"
                          >
                            <div>
                              <div className="font-bold text-ink">{st.name}</div>
                              <div className="text-[11px] text-slate-500">{st.admissionNumber} {st.className ? `(${st.className})` : ''}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleInspectStudent(st.id)}
                              className="text-xs font-bold text-primary hover:underline ml-2"
                            >
                              Inspect
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('manual')}
                      className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-800"
                    >
                      <UserCheck size={15} />
                      Switch to Single Student View to Verify Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MANUAL SINGLE STUDENT ENTRY & EDIT                  */}
      {/* ========================================================= */}
      {activeTab === 'manual' && (
        <form className={`${panel} ${formGrid} bg-white`} onSubmit={submitManual}>
          <div className="flex flex-col gap-1 border-b border-line pb-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-ink">Single Student Result Entry</h2>
            <p className="text-xs text-slate-500">
              {hasSavedResults
                ? 'Editing saved results for this student and term.'
                : 'Enter CA and exam scores for each subject.'}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 max-[1040px]:grid-cols-2 max-[760px]:grid-cols-1">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">Session</label>
              <select
                required
                value={filters.sessionId}
                onChange={(e) => setFilters({ ...filters, sessionId: e.target.value })}
              >
                {lookups.sessions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.session_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">Term</label>
              <select
                required
                value={filters.termId}
                onChange={(e) => setFilters({ ...filters, termId: e.target.value })}
              >
                {lookups.terms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.term_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">Student</label>
              <select
                required
                value={filters.studentId}
                onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
              >
                {lookups.students.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.first_name} {item.last_name} ({item.admission_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">Attendance (Days)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 95"
                value={filters.attendance}
                onChange={(e) => setFilters({ ...filters, attendance: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">Principal's Remark</label>
            <textarea
              placeholder="Enter principal or class teacher remark for this student..."
              value={filters.principalRemark}
              onChange={(e) => setFilters({ ...filters, principalRemark: e.target.value })}
            />
          </div>

          <div className="mb-3 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 sm:hidden">
            Use the responsive row view on mobile to enter scores.
          </div>

          {loadingSavedResults && (
            <p className="m-0 text-sm font-semibold text-slate-500 flex items-center gap-2">
              <RefreshCw className="animate-spin" size={16} /> Loading saved results...
            </p>
          )}

          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>1st CA (20)</th>
                  <th>2nd CA (20)</th>
                  <th>Exam (60)</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {lookups.subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td data-label="Subject">{subject.subject_name}</td>
                    <td data-label="1st CA">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={scores[subject.id]?.firstCa || ''}
                        onChange={(e) => updateScore(subject.id, 'firstCa', e.target.value)}
                      />
                    </td>
                    <td data-label="2nd CA">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={scores[subject.id]?.secondCa || ''}
                        onChange={(e) => updateScore(subject.id, 'secondCa', e.target.value)}
                      />
                    </td>
                    <td data-label="Exam">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={scores[subject.id]?.exam || ''}
                        onChange={(e) => updateScore(subject.id, 'exam', e.target.value)}
                      />
                    </td>
                    <td data-label="Total">
                      <strong>{totals[subject.id] || 0}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {message && <p className="m-0 font-bold text-primary-dark">{message}</p>}

          <button type="submit" className={primaryButton} disabled={saving || loadingSavedResults}>
            {hasSavedResults ? <Edit3 size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : hasSavedResults ? 'Update Results' : 'Save Results'}
          </button>
        </form>
      )}
    </section>
  );
}
