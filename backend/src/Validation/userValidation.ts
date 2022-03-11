import { object, string } from "yup";

let usernameValidation = string()
  .matches(/^[a-zA-Z\d]+$/, "must only contain letters and numbers")
  .min(3)
  .max(30);
let emailValidation = string().email("must be a valid email address");
let passwordValidation = string()
  .min(8)
  .max(50)
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, {
    message:
      "must contain 1 upper case, lower case, numeric, and special character",
  });

export const registerUserSchema = object({
  username: usernameValidation.required(),
  password: passwordValidation.required(),
  email: emailValidation.required(),
});

export const updateUserSchema = object({
  username: usernameValidation,
  password: string().when("newPassword", {
    is: (newPassword: string) => newPassword.length > 0,
    then: string().required(),
  }),
  newPassword: passwordValidation,
});
