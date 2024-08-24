import dayjs from 'dayjs';

export default function Film(id, title, userId = 1, favourite = false, watchDate = null, rating = 0){

    this.id = id;
    this.title = title;
    this.userId = userId;
    this.favourite = favourite;
    this.watchDate = watchDate && dayjs(watchDate).format('YYYY-MM-DD');
    this.rating = rating;
}