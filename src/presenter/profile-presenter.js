import ProfileView from '../view/profile-view.js';
import {render} from '../framework/render.js';

export default class ProfilePresenter {
  init(profileContainer, rating) {
    render(new ProfileView(rating), profileContainer);
  }
}
