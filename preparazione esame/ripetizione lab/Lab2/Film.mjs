import dayjs from 'dayjs';

export default function Film(id, title, userId = 1, favourites = false, watchDate = null, rating = 0){

    this.id = id;
    this.title = title;
    this.userId = userId;
    this.favourites = favourites;
    this.watchDate = watchDate && dayjs(watchDate).format('YYYY-MM-DD');
    this.rating = rating;
}