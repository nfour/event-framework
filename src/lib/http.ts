export function normalizeHeaders (input: {} = {}) {
  return Object.keys(input).reduce((obj, key) => {
    obj[key.toLowerCase()] = input[key];
    return obj;
  }, {});
}
