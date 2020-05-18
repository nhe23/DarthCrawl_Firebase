export const debounce = (v) => {
  let timer;
  clearTimeout(timer);
  let value;
  timer = setTimeout(() => {
    value =v();
  }, 750);
};


export const validateEmail = (email) => {
  if (
    email &&
    email.length >= 5 &&
    email.includes("@") &&
    email.includes(".")
  ) {
    return true;
  }
  return false;
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
