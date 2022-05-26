const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloat = (a = 0, b = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

const getChangedArray = (array) => {
  const copy = array.slice();
  const newArray = [];

  for (let i = getRandomInteger(1, copy.length); i > 0; i--) {
    newArray.push(copy.splice(getRandomInteger(0, copy.length - 1), 1)[0]);
  }

  return newArray;
};

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const getRandomDate = (startDate, endDate) => new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));


export {getRandomInteger, getRandomFloat, getChangedArray, getRandomArrayElement, getRandomDate};
