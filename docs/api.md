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
| POST | `/students` | Create student with optional passport upload |
| GET | `/students/:id` | Get one student |
| PUT | `/students/:id` | Update student and optionally replace passport |
| DELETE | `/students/:id` | Delete student |
| DELETE | `/students/:id/passport` | Delete student passport |
| GET/POST | `/classes` | List or create classes |
| PUT/DELETE | `/classes/:id` | Update or delete a class |
| GET/POST | `/subjects` | List or create subjects |
| PUT/DELETE | `/subjects/:id` | Update or delete a subject |
| GET/POST | `/sessions` | List or create academic sessions |
| PUT/DELETE | `/sessions/:id` | Update or delete session |
| GET/POST | `/terms` | List or create terms |
| PUT/DELETE | `/terms/:id` | Update or delete term |
| POST | `/results/bulk` | Save all subject results for a student |
| GET | `/results/student/:studentId` | Get a student's results by session and term |

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

