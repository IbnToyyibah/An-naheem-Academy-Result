# API Endpoint Documentation

Base URL: `https://an-naheem-academy-result-backend.onrender.com`

Private endpoints require Authorization: Bearer <token>.

## Authentication

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| POST | `/auth/admin/login` | Public | Admin login with email and password |
| POST | `/auth/parent/login` | Public | Parent login with admission number and default password `0823` |
| GET | `/auth/me` | Admin/Parent | Return the authenticated user |
| PATCH | `/auth/parent/password` | Parent | Returns an error because parent passwords use the fixed default `0823` |

## Admin

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/admin/dashboard` | Dashboard statistics and recent activities |
| GET | `/students` | List/search students |
| POST | `/students` | Create student with optional Cloudinary passport upload |
| POST | `/students/upload-csv` | Import students from a CSV multipart file (`csvFile`); optional `classId` is the fallback class for rows without a class |
| GET | `/students/:id` | Get one student |
| PUT | `/students/:id` | Update student and optionally replace Cloudinary passport |
| DELETE | `/students/:id` | Delete student |
| DELETE | `/students/:id/passport` | Delete student passport |
| GET/POST | `/classes` | List or create classes |
| PUT/DELETE | `/classes/:id` | Update or delete a class |
| GET/POST | `/subjects` | List or create subjects; POST accepts `class_levels` (`junior`, `senior`, or both) |
| PUT/DELETE | `/subjects/:id` | Update or delete a subject |
| GET/POST | `/sessions` | List or create academic sessions |
| PUT/DELETE | `/sessions/:id` | Update or delete session |
| GET/POST | `/terms` | List or create terms |
| PUT/DELETE | `/terms/:id` | Update or delete term |
| POST | `/results/bulk` | Save all subject results for a student |
| PUT | `/results/student/:studentId` | Update all subject results for a student |
| GET | `/results/student/:studentId` | Get a student's results by session and term |
| GET | `/results/csv-template` | Download CSV result template (blank or pre-filled with students) |
| POST | `/results/upload-csv` | Bulk upload results via CSV for multiple individual students |

## Public student passport upload

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/public/classes` | List available classes for student BIODATA registration; no login required |
| POST | `/public/student-passport` | Submit student BIODATA (`fullName`, `classId`, `gender`, `admissionNumber`) and JPG/PNG passport (`passport`); registers a student when the ID is new, no login required |

Admission numbers use `ANA/JSS1/001` through `ANA/SS3/001` format without a trailing letter. Before deploying this format, stop the backend and run `npm run migrate:admission-numbers --workspace backend` to review the class counts, then rerun with `-- --apply` to renumber students sequentially from `001` in each class.

Subjects are assigned to `junior`, `senior`, or both class levels. JSS subjects remain junior-only except English Language, Mathematics, and Agricultural Science, which are shared. SS subjects include English Language, Mathematics, Biology, Chemistry, Physics, Further Mathematics, Agricultural Science, Commerce, Accounting, Economics, Financial Accounting, Marketing, Literature in English, Government, and Yoruba.

Student CSV files must contain `first_name` and `last_name`, or `student_name`. Optional columns include `admission_number`, `class`, `gender`, `date_of_birth` (`YYYY-MM-DD`), `parent_name`, `parent_phone`, and `parent_email`. Missing admission numbers are generated. Student imports do not include scores; upload results separately using those admission numbers so each result is matched to its student.

## Parent

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/parent/profile` | Student and parent profile |
| GET | `/parent/results` | Result table and academic summary |

## Result Payload

```json
{
  "studentId": 1,
  "sessionId": 1,
  "termId": 1,
  "attendance": 91,
  "principalRemark": "A focused learner.",
  "scores": [
    { "subjectId": 1, "firstCa": 18, "secondCa": 17, "exam": 52 }
  ]
}
```

The API validates CA and exam limits, then calculates `total`, `grade`, and `remark`.
