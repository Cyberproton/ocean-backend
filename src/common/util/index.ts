export const toKebabCase = (str): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export const parseBoolean = (str: string, strict = true): boolean => {
  if (strict) {
    if (str === 'true') return true;
    if (str === 'false') return false;
    throw new Error('Cannot parse boolean');
  }

  return !!str;
};
