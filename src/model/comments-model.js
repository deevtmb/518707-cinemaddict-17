import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor (commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments () {
    return this.#comments;
  }

  init = async (film) => {
    try {
      const comments = await this.#commentsApiService.getComments(film);
      this.#comments = comments;
    } catch(err) {
      this.#comments = [];
    }
  };

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
