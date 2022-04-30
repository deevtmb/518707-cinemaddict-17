import ProfileView from '../view/profile-view.js';
import {render} from '../render.js';

export default class ProfilePresenter {
  init(profileContainer) {
    render(new ProfileView, profileContainer);
  }
}
