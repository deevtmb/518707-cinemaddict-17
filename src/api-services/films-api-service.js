import ApiService from '../framework/api-service.js';
import {renameToSnakeCase} from '../utils/object-var-rename.js';
import {ApiMethod} from '../utils/const.js';

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: ApiMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {...film};
    renameToSnakeCase(adaptedFilm);
    renameToSnakeCase(adaptedFilm.film_info);
    renameToSnakeCase(adaptedFilm.film_info.release);
    renameToSnakeCase(adaptedFilm.user_details);

    return adaptedFilm;
  };
}
