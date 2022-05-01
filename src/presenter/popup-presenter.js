import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class ProfilePresenter {
  init(popupContainer) {
    render(new PopupView, popupContainer);
  }
}
