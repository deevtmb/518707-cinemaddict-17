import AbstractView from '../framework/view/abstract-view.js';
import {getProfileRating} from '../utils/profile.js';

const createProfileTemplate = (films) => (
  `<section class="header__profile profile ${getProfileRating(films) ? '' : 'visually-hidden'}">
    <p class="profile__rating">${getProfileRating(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileView extends AbstractView {
  #films;

  constructor (films) {
    super();
    this.#films = films;
  }

  get template() {
    return createProfileTemplate(this.#films);
  }
}
