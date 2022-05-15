import {generateFilm} from '../mock/films.js';

export default class FilmsModel {
  #films = Array.from({length: 13}, generateFilm).map((film, id) => {
    film.id = ++id;
    return film;
  });

  get films () {
    return this.#films;
  }
}
