import { getRandomFloat, getRandomInteger, getRandomArrayElement, getChangedArray, getRandomDate } from './utils.js';
import { randomComments } from './comments.js';

const FILMS = [
  {
    title: 'Made for Each Other',
    poster: './images/posters/made-for-each-other.png',
  },
  {
    title: 'Popeye Meets Sinbad',
    poster: './images/posters/popeye-meets-sinbad.png',
  },
  {
    title: 'Sagebrush Trail',
    poster: './images/posters/sagebrush-trail.jpg',
  },
  {
    title: 'Santa Claus Conquers the Martians',
    poster: './images/posters/santa-claus-conquers-the-martians.jpg',
  },
  {
    title: 'The Dance of Life',
    poster: './images/posters/the-dance-of-life.jpg',
  },
  {
    title: 'The Great Flamarion',
    poster: './images/posters/the-great-flamarion.jpg',
  },
  {
    title: 'The Man With The Golden Arm',
    poster: './images/posters/the-man-with-the-golden-arm.jpg',
  },
];

const MOVIE_MAKERS = [
  'Tim Burton',
  'Francis Ford Coppola',
  'Frank Darabont',
  'Peter Faiman',
  'Bryan Singer',
  'Christopher Nolan',
  'Eric Toledano',
  'Matthew Vaughn',
];

const ACTORS = [
  'Dwayne Johnson',
  'Rose Byrne',
  'Rachel McAdams',
  'Michelle Rodriguez',
  'Tom Hanks',
  'Jake Gyllenhaal',
  'Tom Hardy',
];

const COUNTRIES = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Cyprus',
  'Czech Republic',
  'Germany',
  'Denmark',
  'Estonia',
  'Spain',
];

const GENRES = [
  'Action',
  'Animation',
  'Comedy',
  'Drama',
  'Historical',
  'Horror',
  'Adventure',
  'Western',
];

const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';

export const generateFilm = () => {
  const film = FILMS[getRandomInteger(0, FILMS.length - 1)];

  return {
    id: 0,
    comments: getChangedArray(randomComments.map((comment) => comment.id)),
    filmInfo: {
      title: film.title,
      alternativeTitle: film.title.split('').reverse().join(''),
      totalRating: +getRandomFloat(0.0, 10.0).toFixed(1),
      poster: film.poster,
      ageRating: getRandomInteger(0, 18),
      director: getRandomArrayElement(MOVIE_MAKERS),
      writers: getChangedArray(MOVIE_MAKERS),
      actors: getChangedArray(ACTORS),
      release: {
        date: getRandomDate(new Date(1950, 1, 1), new Date),
        releaseCountry: getRandomArrayElement(COUNTRIES),
      },
      runtime: getRandomInteger(40, 180),
      genre: getChangedArray(GENRES),
      description: `${TEXT.split('.', getRandomInteger(1, TEXT.split('.').length)).join('.')}.`
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: getRandomDate(new Date(2010, 1, 1), new Date),
      favorite: Boolean(getRandomInteger(0, 1))
    },
  };
};
