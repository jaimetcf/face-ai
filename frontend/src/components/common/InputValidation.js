const MIN_LENGTH = 0;
const MAX_LENGTH = 1;
const MIN_VALUE = 2;
const MAX_VALUE = 3;
const FILE = 4;
const EMAIL = 5;

export const validateMinLength = (minLength) => ({ type: MIN_LENGTH, minLength: minLength });
export const validateMaxLength = (minLength) => ({ type: MAX_LENGTH, minLength: minLength });
export const validateMinValue  = (minValue)  => ({ type: MIN_VALUE , minValue: minValue });
export const validateMaxValue  = (maxValue)  => ({ type: MAX_VALUE , maxValue: maxValue });
export const validateFileName  = ()          => ({ type: FILE });
export const validateEmail     = ()          => ({ type: EMAIL });

export const validate = (value, validationList) => {
  let isValid = true;
  for (const validation of validationList) {
    if (validation.type === MIN_LENGTH) {
      isValid = isValid && value.trim().length >= validation.minLength;
    }
    if (validation.type === MAX_LENGTH) {
      isValid = isValid && value.trim().length <= validation.maxLength;
    }
    if (validation.type === MIN_VALUE ) {
      isValid = isValid && +value >= validation.minValue;
    }
    if (validation.type === MAX_VALUE) {
      isValid = isValid && +value <= validation.maxValue;
    }
    if (validation.type === EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
  }
  return isValid;
};
