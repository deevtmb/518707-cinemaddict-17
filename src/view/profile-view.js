import {createElement} from '../render.js';

const createProfileTemplate = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating ${rating ? '' : 'visually-hidden'}">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileView {
  constructor (rating) {
    this.rating = rating;
  }

  getTemplate() {
    return createProfileTemplate(this.rating);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
