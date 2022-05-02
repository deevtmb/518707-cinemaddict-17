import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class ProfilePresenter {
  init(popupContainer, film) {
    render(new PopupView(film), popupContainer);
  }
}
