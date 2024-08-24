## APIs

### __List of All the Films__

__URL__: `/api/films`

__HTTP Method__: GET.

__Description__: Retrieve all the available films.

__Request Body__: _None_.

__Request Query Parameters__: _filter_ name of the filter to apply (_filter-all_, _filter-favourite_, _filter-best_, _filter_lastmonth_, _filter-unseen_).

__Response__: `200 OK` (success), `500 Internal Server Error` (database error).

__Response Body__: Array of objects, each one describing a film.
``` json
[
    {
        "id": 1,
        "title": "Pulp Fiction",
        "userId": 1,
        "favourite": true,
        "watchDate": "26-08-2024",
        "rating": 5
    },
    ...
]
```



### __Get Film by Id__

__URL__: `/api/films/:id`

__HTTP Method__: GET.

__Description__: Retrieve the film corresponding to the passed _id_.

__Request body__: _None_.

__Response__: `200 OK` (success), `500 Internal Server Error` (database error), `404 Not Found` (not present in the database or unavailable).

__Response Body__:
``` json
{
    "id": 1,
    "title": "Pulp Fiction",
    "userId": 1,
    "favourite": true,
    "watchDate": "26-08-2024",
    "rating": 5
}
```



### __Add a New Film__

__URL__: `/api/films`

__HTTP Method__: POST.

__Description__: Create a new film by providing all its informations and add it to a specified user.

__Request Body__: informations needed about the film.
``` json
{
    "title": "Pulp Fiction",
    "userId": 1,
    "favourite": true,
    "watchDate": "26-08-2024",
    "rating": 5
}
```

__Response__: `200 OK` (success), `500 Internal Server Error` (database error), `422 Unprocessable Entity` (invalid input), `404 Not Found` (not present or unavailable).

__Response Body__: 



### __Update a Film__

__URL__: `/api/films/:id`

__HTTP Method__: PUT.

__Description__: Update the stored informations of the film corresponding to the _id_.

__Request Body__: new informations about the film.
``` json
{
    "title": "Pulp Fiction",
    "userId": 1,
    "favourite": true,
    "watchDate": "26-08-2024",
    "rating": 5
}
```

__Response__: `200 OK` (success), `422 Unprocessable Entity` (invalid input), `404 Not Found` (not present or unabailable), `503 Service Unavailable` (database error).

__Response Body__: _None_.



### __Update Film Rating__

__URL__: `/api/films/:id/rating`

__HTTP Method__: PUT.

__Description__: Update the rating of the film identified by _id_.

__Request Body__: new rating value.
``` json
{
    "rating": 3
}
```

__Response__: `200 OK` (success), `404 Not Found` (not present or unavailable), `503 Service Unavailable` (database error).

__Response Body__: _None_.




### __Mark Film as Favourite__

__URL__: `/api/films/:id/favourite`

__HTTP Method__: PUT.

__Description__: Mark the film identified by _id_ as favourite.

__Request Body__: new rating value.
``` json
{
    "favourite": true
}
```
__Response__: `200 OK` (success), `404 Not Found` (not present or unavailable), `503 Service Unavailable` (database error).

__Response Body__: _None_.


### __Delete a Film__

__URL__: `/api/films/:id`

__HTTP Method__: DELETE.

__Description__: Delete a film given its _id_.

__Request Body__: _None_.

__Response__: `200 OK` (success), `404 Not Found` (not present or unavailable), `503 Service Unavailable` (database error).

__Response Body__: _None_.



<!--
### __Name of the API__

__URL__: ``

__HTTP Method__:

__Description__:

__Request Query Parameters__: 

__Request Body__: _descrizione contenuto_
``` json
{

}
```

__Response__: `status code` (meaning)

__Response Body__:
``` json
{

}
```
-->