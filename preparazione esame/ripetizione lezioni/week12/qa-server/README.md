# `qa-server`

The `qa-server` is the server-side app companion for HeapOverrun. It presents some APIs to perform some CRUD operations on questions and their answers.

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __List all questions__

URL: `/api/questions`

HTTP Method: GET.

Description: Retrieve all questions.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "text": "E' meglio js o python?",
    "email": "alex.scavone@hotmail.it",
    "date": "2024-02-07"
  },
  ...
]
```

### __Get a single question__

URL: `/api/questions/<id>`

HTTP Method: GET.

Description: Retrieve the question represented by the id.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error) or `404 Not Found` (wrong id).

Response body:
```
{
  "id": 1,
  "text": "E' meglio js o python?",
  "email": "alex.scavone@hotmail.it",
  "date": "2024-02-07"
}
```

### __Get all the answers of a single question__

URL: `/api/questions/<id>/answers`

HTTP Method: GET.

Description: Retrieve all the answers of the question represented by the id.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error) or `404 Not Found` (wrong id).

Response body:
```
[
  {
    "id": 1,
    "text": "yes",
    "email": "prova@hotmail.it",
    "score": -1,
    "date": "2024-02-07",
  },
  ...
]
```


### __Create a new answer for a given question__

URL: `/api/questions/<id>/answers`

HTTP Method: POST.

Description: Create a new answer for the question represented by the id.

Request body:
```
{
  "text": "yes",
  "email": "prova@hotmail.it",
  "score": -1,
  "date": "2024-02-07",
}
```

Response: `201 Created` (success with the created id) or `503 Service Unavailable` (generic error) or `404 Not Found` (wrong id). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: __None__


