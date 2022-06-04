import ApiService from '../framework/api-service.js';

// const Method = {
//   GET: 'GET',
//   POST: 'POST',
//   DELETE: 'DELETE'
// };

export default class CommentsApiService extends ApiService {
  getComments(film) {
    return this._load({url: `comments/${film.id}`})
      .then(ApiService.parseResponse);
  }
}
