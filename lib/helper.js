
const getUserFullName = (user) => {
    return user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name;
}

const modifyPhoneNumber = (number) => {
    return number
        .replace(/\+7/g, '8')
        .replace(/[()-]/g, '')
        .replace(/\s/g, '');
}

module.exports = {
    getUserFullName,
    modifyPhoneNumber
}