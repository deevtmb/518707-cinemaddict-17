import { generateComment } from '../mock/comments.js';

export default class CommentsModel {
  #comments = [];

  get comments () {
    for (let i = 1; i <= 10; i++) {
      this.#comments.push(generateComment(i));
    }
    return this.#comments;
  }
}
