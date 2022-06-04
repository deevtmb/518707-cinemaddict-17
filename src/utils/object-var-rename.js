import camelcase from 'camelcase';
import decamelize from 'decamelize';

const renameToCamelCase = (obj) => {
  for (const [key, value] of Object.entries(obj)) {
    if (key !== camelcase(key)) {
      obj[camelcase(key)] = (typeof value === 'object' && value !== null) ? {...value} : value;
      delete obj[key];
    }
  }
};

const renameToSnakeCase = (obj) => {
  for (const [key, value] of Object.entries(obj)) {
    if (key !== decamelize(key)) {
      obj[decamelize(key)] = (typeof value === 'object' && value !== null) ? {...value} : value;
      delete obj[key];
    }
  }
};

export {renameToCamelCase, renameToSnakeCase};
