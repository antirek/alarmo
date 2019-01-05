
const getUserFullName = (user: any) => {
  return user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name;
};

const modifyPhoneNumber = (numberIn: any) => {
  return numberIn
    .replace(/\+/g, "")
    .replace(/^7/g, "8")
    .replace(/[()-]/g, "")
    .replace(/\s/g, "");
};

export {
  getUserFullName,
  modifyPhoneNumber,
};
