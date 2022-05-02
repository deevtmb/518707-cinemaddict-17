import {getRandomInteger, getRandomArrayElement, getRandomDate} from './utils.js';

const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';
const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const COMMENTS_AMOUNT = 10;
const COMMENT_AUTHORS = [
  'Tim Burton',
  'Francis Ford Coppola',
  'Frank Darabont',
  'Peter Faiman',
  'Bryan Singer',
  'Christopher Nolan',
  'Eric Toledano',
  'Matthew Vaughn',
  'Dwayne Johnson',
  'Rose Byrne',
  'Rachel McAdams',
  'Michelle Rodriguez',
  'Tom Hanks',
  'Jake Gyllenhaal',
  'Tom Hardy',
];

const generateRandomComment = (commentId) => (
  {
    id: commentId,
    author: getRandomArrayElement(COMMENT_AUTHORS),
    comment: `${TEXT.split('. ')[getRandomInteger(0, TEXT.split('. ').length - 1)]}.`,
    date: getRandomDate(new Date(2010, 1, 1), new Date),
    emotion: getRandomArrayElement(EMOTIONS)
  }
);

const getRandomComments = () => {
  const comments = [];

  for (let i = 1; i <= COMMENTS_AMOUNT; i++) {
    comments.push(generateRandomComment(i));
  }

  return comments;
};

export const randomComments = getRandomComments();
