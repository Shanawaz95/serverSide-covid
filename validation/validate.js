module.exports.registerValidation = (
  username,
  password,
  confirmPassword,
  email
) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Give a name for yourself.";
  }

  if (password.trim() === "") {
    errors.password =
      "you can't say 'Open sesame' to enter. You might want to create a password for yourself.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "passwords do not match...";
  }

  if (email.trim() === "") {
    errors.email =
      "I solemnly swear that i'll not spam your mail box. Please enter a mail Id.";
  } else {
    const regEx = /^([a-zA-Z0-9]([-.\w]*[0-9a-zA-Z])*@([a-zA-Z0-9][-\w]*[a-zA-Z0-9-]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Enter a valid email address. Dummy ones will also work.";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length < 1,
  };
};

module.exports.loginValidation = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "what do you call yourself?";
  }

  if (password.trim() === "") {
    errors.password = "type your password to enter";
  }
  return {
    errors,
    isValid: Object.keys(errors).length < 1,
  };
};
