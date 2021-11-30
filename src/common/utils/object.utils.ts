export const removeUndefinedFiled = (object: any): any => {
  Object.keys(object).forEach(
    (key) => object[key] === undefined && delete object[key]
  );

  return object;
};
