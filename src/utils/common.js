import dayjs from 'dayjs';

const DESCRIPTION_PREVIEW_LENGTH = 140;
const MINUTES_IN_HOUR = 60;

const getFormatedRuntime = (runtime) => {
  const runtimeHours = Math.floor(runtime / MINUTES_IN_HOUR);
  const runtimeMinutes = runtime % MINUTES_IN_HOUR;

  if (runtimeHours) {
    return `${runtimeHours}h ${runtimeMinutes}m`;
  }

  return `${runtimeMinutes}m`;
};

const getDescriptionPreview = (descriprion, maxSymbols = DESCRIPTION_PREVIEW_LENGTH, lastSymbol = '...') => (
  descriprion.length > maxSymbols
    ? `${descriprion.substring(0, DESCRIPTION_PREVIEW_LENGTH - 1)}${lastSymbol}`
    : descriprion
);

const getFormatedDate = (date, format) => dayjs(date).format(format);

const sortFilmsByRating = (filmA, filmB) => (filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
const sortFilmsByDate = (filmA, filmB) => (dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date)));
const sortFilmsByCommentsAmount = (filmA, filmB) => (filmB.comments.length - filmA.comments.length);

export {sortFilmsByDate, sortFilmsByRating, sortFilmsByCommentsAmount, getFormatedRuntime, getFormatedDate, getDescriptionPreview};
