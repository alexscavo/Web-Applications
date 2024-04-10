# `qa-server`

The `qa-server` is the server-side app companion for HeapOverrun. It presents some APIs to perform some CRUD operations on questions and their answers.

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __List all questions__

URL: `/api/questions`

HTTP Method: GET.

Description: Retrieve all the questions.

Response: `200 OK` (success) or `500 Internal Server Error` (gerneric error).

Response body:
```
[
  {
    "id": 1,
    "question": "Is JavaScript better than Python?",
    "email": "alex.scavone@hotmail.it",
    "date": "2024-02-07"
  },
  ...
]
```

### __Get a single question__

URL: `/api/question/<id>`

HTTP Method: GET.

Description: Retrieve the question represented by `<id>`.

Response: `200 OK` (success) or `404 Not Found` (wrong id) or `500 Internal Server Error` (gerneric error).

Response body:
```
{
  "id": 1,
  "question": "Is JavaScript better than Python?",
  "email": "alex.scavone@hotmail.it",
  "date": "2024-02-07"
}
```

### __Get all the answer of a single question__

URL: `/api/questions/<id>/answers`

HTTP Method: GET.

Description: Retrieve all the answers of the question represented by `<id>`.

Response: `200 OK` (success) or `404 Not Found` (wrong id) or `500 Internal Server Error` (gerneric error).

Response body:
```
[
  {
    "id": 1
    "text": "Yes", 
    "email": "alex.scavone@hotmail.it",
    "score": -10,
    "data": "2024-02-08"
  },
  ...
]
```

### __Create a new answer for a given question__

URL: `/api/questions/<id>/answers`

HTTP Method: POST.

Description: Create a new answer to the question represente by `<id>`.

Request body:
```
{
  "text": "Last year, it had about 220 first-timers", 
  "email": "alex.scavone@hotmail.it",
  "score": 0,
  "data": "2024-03-26"
}
```

Response: `201 Created` (success, with the created Id) or `404 Not Found` (wrong id) or `503 Service Unavailable` (gerneric error). If the request body is not valid,  `422 Unprocessable Entity` (validation error).

Response body: __None__
