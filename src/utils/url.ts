export const queryToObject = (query: string) => {
  return Object.fromEntries(new URLSearchParams(query).entries());
};
