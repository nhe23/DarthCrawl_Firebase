// export const debounce = (v) => {
//   let timer;
//   clearTimeout(timer);
//   let value;
//   timer = setTimeout(() => {
//     value = v();
//     console.log(value);
//   }, 750);
//   console.log(value);
//   return value;
// };

const debounce = (v) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    val = v;
  }, 750);
};
export const validateEmail = (email) => {
  console.log("EXECUTED");
  if (
    email &&
    email.length >= 5 &&
    email.includes("@") &&
    email.includes(".")
  ) {
    console.log("return");
    return true;
  }
  console.log("return");
  return false;
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
