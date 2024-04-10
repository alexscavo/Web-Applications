# `Film Library Server`

the `Film Library Server` is a server that presents some APIs to perform some CRUD operations on the film library.

## APIs

Now we list all the avilable APIs for this server

### __List all films__

URL: `/api/films`

HTTP Method: GET.

Description: Retrieve all the films.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "title": "21 Grams",
    "isFavourite": "1",
    "rating": "4",
    "watchDate": "2024-03-17",
    "userId": "1"
  },
  ...
]
```

### __List all the favourite films__

URL: `/api/films/filtered`

HTTP Method: GET.

Description: Retrieve all the favourite films.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "title": "21 Grams",
    "isFavourite": "1",
    "rating": "4",
    "watchDate": "2024-03-17",
    "userId": "1"
  },
  ...
]
```

### __List all the best films__

URL: `/api/films/filtered`

HTTP Method: GET.

Description: Retrieve all the best films, i.e. those rated 5 out of 5.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "title": "Pulp fiction",
    "isFavourite": "1",
    "rating": "5",
    "watchDate": "2024-03-10",
    "userId": "1"
  },
  ...
]
```

### __List all the films seen in the last month__

URL: `/api/films/filtered`

HTTP Method: GET.

Description: Retrieve all the films seen in the last month.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "title": "21 Grams",
    "isFavourite": "1",
    "rating": "4",
    "watchDate": "2024-03-17",
    "userId": "1"
  },
  ...
]
```

### __List all the unseen films__

URL: `/api/films/filtered`

HTTP Method: GET.

Description: Retrieve all the unseen films.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "title": "21 Grams",
    "isFavourite": "1",
    "rating": "4",
    "watchDate": "2024-03-17",
    "userId": "1"
  },
  ...
]
```

### __Retrieve a specific film__

URL: `/api/films/<filmId>`

HTTP Method: GET.

Description: Retrieve a specific film given it's Id.

Response: `200 OK` (success) or `404 Not Found` (wrong Id) or `500 Internal Server Error` (generic error).

Response body:
```
{
  "id": 1,
  "title": "21 Grams",
  "isFavourite": "1",
  "rating": "4",
  "watchDate": "2024-03-17",
  "userId": "1"
}
```

### __Create a new film__

URL: `/api/films`

HTTP Method: POST.

Description: Retrieve all the unseen films.

Request body:
```
{
  "title": "21 Grams",
  "isFavourite": "1",
  "rating": "4",
  "watchDate": "2024-03-17",
  "userId": "1"
}
```

Response: `201 Created` (success with the created Id) or `500 Internal Server Error` (generic error) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (avlidation error).

Response body:
__None__


### __Update a specific film informations__

URL: `/api/films/<filmId>`

HTTP Method: PUT.

Description: Update the informations of a specific film.

Request body:
```
{
  "title": "21 Grams",
  "isFavourite": "1",
  "rating": "4",
  "watchDate": "2024-03-17",
  "userId": "1"
}
```

Response: `200 OK` (success) or `404 Not Found` (wrong id) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body:
__None__


### __Create a new film__

URL: `/api/films`

HTTP Method: POST.

Description: Retrieve all the unseen films.

Request body:
```
{
  "title": "21 Grams",
  "isFavourite": "1",
  "rating": "4",
  "watchDate": "2024-03-17",
  "userId": "1"
}
```

Response: `201 Created` (success with the created Id) or `500 Internal Server Error` (generic error) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (avlidation error).

Response body:
__None__
