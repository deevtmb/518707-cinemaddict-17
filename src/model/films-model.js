import {generateFilm} from '../mock/film.js';

export default class FilmsModel {
  generateFilms = Array.from({length: 15}, generateFilm);

  getFilms = () => this.generateFilms;
}
