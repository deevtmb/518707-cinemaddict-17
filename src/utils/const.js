const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites'
};

const PopupState = {
  HIDDEN: 'HIDDEN',
  OPEN: 'OPEN'
};

const DateFormat = {
  POPUP_RELEASE_DATE: 'DD MMMM YYYY',
  FILM_CARD_RELEASE_DATE: 'YYYY'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const ExtraFilmTitle = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented'
};

const ApiMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export {SortType, FilterType, PopupState, DateFormat, UpdateType, UserAction, ExtraFilmTitle, ApiMethod, EMOTIONS};
