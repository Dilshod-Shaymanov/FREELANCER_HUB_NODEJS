export function to(promise) {
  return promise
    .then((response) => [null, response])
    .catch((error) => [error, null]);
}
