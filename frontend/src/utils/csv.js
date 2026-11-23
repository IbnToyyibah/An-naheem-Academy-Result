/**
 * Client-side CSV helper for parsing, validating, and generating result upload templates.
 */

export function parseCsvText(rawText) {
  if (!rawText) return [];

  let text = String(rawText);
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  const firstLine = text.split(/\r\n|\n|\r/)[0] || '';
  let delimiter = ',';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
  else if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === delimiter && !insideQuote) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell.trim());
      currentCell = '';
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function normalizeHeaderKey(header) {
  return String(header || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

const FIELD_SYNONYMS = {
  admission_number: [
    'admission_number', 'admission_no', 'adm_no', 'adm_number', 'admissionno',
    'student_id', 'admission', 'reg_no', 'registration_number', 'student_admission_number'
  ],
  student_name: [
    'student_name', 'name', 'full_name', 'student', 'studentname'
  ],
  subject: [
    'subject', 'subject_name', 'course', 'course_name', 'subjectname'
  ],
  first_ca: [
    'first_ca', '1st_ca', 'ca1', 'ca_1', 'firstca', '1stca', 'test_1', 'assessment_1',
    'first_continuous_assessment', 'first_ca_20', '1st_ca_20'
  ],
  second_ca: [
    'second_ca', '2nd_ca', 'ca2', 'ca_2', 'secondca', '2ndca', 'test_2', 'assessment_2',
    'second_continuous_assessment', 'second_ca_20', '2nd_ca_20'
  ],
  exam: [
    'exam', 'examination', 'exam_score', 'exams', 'exam_60', 'examination_60', 'final_exam'
  ],
  attendance: [
    'attendance', 'attendance_score', 'attendance_days', 'days_present', 'present'
  ],
  principal_remark: [
    'principal_remark', 'principal_remarks', 'remark', 'remarks', 'comment',
    'principal_comment', 'comments', 'teacher_remark'
  ]
};

function matchKnownField(headerKey) {
  for (const [field, synonyms] of Object.entries(FIELD_SYNONYMS)) {
    if (synonyms.includes(headerKey)) return field;
  }
  return null;
}

export function parseCsvRows(csvText) {
  const rows = parseCsvText(csvText);
  if (!rows.length) {
    throw new Error('The selected CSV file appears to be completely empty.');
  }

  const rawHeaders = rows[0];
  const headerKeys = rawHeaders.map(normalizeHeaderKey);

  const colToField = {};
  headerKeys.forEach((key, index) => {
    const matched = matchKnownField(key);
    if (matched) colToField[index] = matched;
  });

  const hasSubjectCol = Object.values(colToField).includes('subject');
  const entries = [];
  const errors = [];

  if (hasSubjectCol) {
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const rowNum = r + 1;
      if (!row || !row.some((cell) => String(cell).trim().length > 0)) continue;

      const record = {};
      row.forEach((cell, idx) => {
        const f = colToField[idx];
        if (f) record[f] = cell.trim();
      });

      if (!record.admission_number) {
        errors.push({ row: rowNum, message: 'Missing admission number' });
        continue;
      }
      if (!record.subject) {
        errors.push({ row: rowNum, message: `Missing subject for ${record.admission_number}` });
        continue;
      }

      entries.push({
        rowNumber: rowNum,
        admissionNumber: record.admission_number,
        studentName: record.student_name || '',
        subject: record.subject,
        firstCa: record.first_ca !== undefined && record.first_ca !== '' ? Number(record.first_ca) : 0,
        secondCa: record.second_ca !== undefined && record.second_ca !== '' ? Number(record.second_ca) : 0,
        exam: record.exam !== undefined && record.exam !== '' ? Number(record.exam) : 0,
        attendance: record.attendance !== undefined && record.attendance !== '' ? Number(record.attendance) : null,
        principalRemark: record.principal_remark || null
      });
    }
  } else {
    // Wide format detection
    const subjectColumnRegex = /^(.+?)_(?:1st_?ca|first_?ca|ca_?1|2nd_?ca|second_?ca|ca_?2|exam|examination)$/i;
    const wideSubjectColumns = [];

    headerKeys.forEach((key, index) => {
      const match = key.match(subjectColumnRegex);
      if (match) {
        const rawSubject = match[1].replace(/_/g, ' ').trim();
        let scoreType = 'exam';
        if (/1st|first|ca_?1/i.test(key)) scoreType = 'first_ca';
        else if (/2nd|second|ca_?2/i.test(key)) scoreType = 'second_ca';

        wideSubjectColumns.push({ index, subjectName: rawSubject, scoreType });
      }
    });

    if (!wideSubjectColumns.length) {
      throw new Error(
        'Could not find a "subject" column in your CSV. Expected headers: admission_number, subject, first_ca, second_ca, exam'
      );
    }

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const rowNum = r + 1;
      if (!row || !row.some((cell) => String(cell).trim().length > 0)) continue;

      let admissionNumber = '';
      let studentName = '';
      let attendance = null;
      let principalRemark = null;

      row.forEach((cell, idx) => {
        const f = colToField[idx];
        if (f === 'admission_number') admissionNumber = cell.trim();
        if (f === 'student_name') studentName = cell.trim();
        if (f === 'attendance' && cell.trim() !== '') attendance = Number(cell.trim());
        if (f === 'principal_remark') principalRemark = cell.trim();
      });

      if (!admissionNumber) {
        errors.push({ row: rowNum, message: 'Missing admission number' });
        continue;
      }

      const subjectMap = {};
      wideSubjectColumns.forEach((col) => {
        const val = row[col.index];
        if (val !== undefined && val !== '') {
          if (!subjectMap[col.subjectName]) {
            subjectMap[col.subjectName] = { firstCa: 0, secondCa: 0, exam: 0 };
          }
          if (col.scoreType === 'first_ca') subjectMap[col.subjectName].firstCa = Number(val);
          if (col.scoreType === 'second_ca') subjectMap[col.subjectName].secondCa = Number(val);
          if (col.scoreType === 'exam') subjectMap[col.subjectName].exam = Number(val);
        }
      });

      for (const [subjectName, scores] of Object.entries(subjectMap)) {
        entries.push({
          rowNumber: rowNum,
          admissionNumber,
          studentName,
          subject: subjectName,
          firstCa: scores.firstCa,
          secondCa: scores.secondCa,
          exam: scores.exam,
          attendance,
          principalRemark
        });
      }
    }
  }

  return { entries, errors };
}

function escapeCsvCell(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsvTemplateContent({ students = [], subjects = [], includeStudents = true, className = 'JSS 1' }) {
  const headers = [
    'admission_number',
    'student_name',
    'class',
    'subject',
    'first_ca',
    'second_ca',
    'exam',
    'attendance',
    'principal_remark'
  ];

  const lines = [headers.join(',')];

  if (includeStudents && students.length && subjects.length) {
    students.forEach((student) => {
      const adm = student.admission_number;
      const name = `${student.first_name || ''} ${student.last_name || ''}`.trim();
      const className = student.class_id?.class_name || student.class_name || '';
      const classLevel = /^SS\s*[1-3]$/i.test(className) ? 'senior' : 'junior';

      subjects
        .filter((subject) => (subject.class_levels || ['junior']).includes(classLevel))
        .forEach((subject) => {
          lines.push([
            escapeCsvCell(adm),
            escapeCsvCell(name),
            escapeCsvCell(className),
            escapeCsvCell(subject.subject_name),
            '',
            '',
            '',
            '',
            ''
          ].join(','));
        });
    });
  } else {
    const classCodeMatch = String(className).match(/^(JSS|SS)\s*([1-3])$/i);
    const classCode = classCodeMatch ? `${classCodeMatch[1].toUpperCase()}${classCodeMatch[2]}` : 'JSS1';
    const classLevel = classCode.startsWith('SS') ? 'senior' : 'junior';
    const applicableSubjects = subjects.filter((subject) => (subject.class_levels || ['junior']).includes(classLevel));

    applicableSubjects.forEach((subject) => {
      lines.push([
        `ANA/${classCode}/001`,
        'Sample Student',
        className,
        subject.subject_name,
        '',
        '',
        '',
        '',
        ''
      ].map(escapeCsvCell).join(','));
    });
  }

  return lines.join('\r\n');
}

export function downloadCsvFile(content, filename = 'results_template.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
