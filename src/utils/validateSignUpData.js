// src/utils/validateSignUpData.js
import validator from "validator";

export const validateSignUpData = ({
  firstName,
  lastName,
  email,
  password,
}) => {
  if (!firstName || !lastName) {
    throw new Error("First and Last name are required.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email format.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong. Example: Shubham@123");
  }
};
