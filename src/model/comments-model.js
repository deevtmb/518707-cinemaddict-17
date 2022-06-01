import Observable from '../framework/observable.js';
import { generateComment } from '../mock/comments.js';

const newComments = () => {
  const comments = [];
  for (let i = 1; i <= 10; i++) {
    comments.push(generateComment(i));
  }
  return comments;
};

export default class CommentsModel extends Observable {
  #comments = newComments();

  get comments () {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    const {film, comment} = update;
    comment.id = this.#comments.length + 1;
    this.#comments.push(comment);
    film.comments.push(comment.id);

    this._notify(updateType, film);
  };

  deleteComment = (updateType, update) => {
    this._notify(updateType, update);
  };
}
