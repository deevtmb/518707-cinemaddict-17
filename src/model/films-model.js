import Observable from '../framework/observable.js';
import {generateFilm} from '../mock/films.js';

export default class FilmsModel extends Observable {
  #films = Array.from({length: 13}, generateFilm).map((film, id) => {
    film.id = ++id;
    return film;
  });

  get films () {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
