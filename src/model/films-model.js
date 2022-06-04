import Observable from '../framework/observable.js';
import {renameToCamelCase} from '../utils/object-var-rename.js';
import {UpdateType} from '../utils/const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor (filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films () {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film};

    renameToCamelCase(adaptedFilm);
    renameToCamelCase(adaptedFilm.filmInfo);
    renameToCamelCase(adaptedFilm.filmInfo.release);
    renameToCamelCase(adaptedFilm.userDetails);

    return adaptedFilm;
  };
}
