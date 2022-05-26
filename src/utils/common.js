import dayjs from 'dayjs';

const DESCRIPTION_PREVIEW_LENGTH = 140;

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getFormatedRuntime = (runtime) => {
  const runtimeHours = Math.floor(runtime / 60);
  const runtimeMinutes = runtime % 60;

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

export {updateItem, sortFilmsByDate, sortFilmsByRating, getFormatedRuntime, getFormatedDate, getDescriptionPreview};
