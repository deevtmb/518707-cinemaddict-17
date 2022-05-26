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

export {SortType, FilterType, PopupState, DateFormat, EMOTIONS};
