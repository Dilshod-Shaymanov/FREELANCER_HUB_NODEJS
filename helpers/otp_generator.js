import { generate } from "otp-generator";
export const generateOtp = () => {
  try {
    return generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  } catch (error) {
    console.log("Error on generate OTP ", error);
  }
};
