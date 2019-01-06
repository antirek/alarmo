
interface ITelegramUser {
  last_name: string;
  first_name: string;
}

const getUserFullName = (user: ITelegramUser): string => {
  return user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name;
};

const modifyPhoneNumber = (numberIn: string): string => {
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
