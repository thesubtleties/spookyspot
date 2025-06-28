export const checkLengths = (password, credential) => {
  return Boolean(password?.length >= 6 && credential?.length >= 4);
};
