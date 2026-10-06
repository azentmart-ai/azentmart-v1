export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function required(value) {
  return String(value || "").trim().length > 0;
}

export function passwordIsValid(value) {
  return String(value || "").length >= 6;
}
