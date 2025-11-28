const { isValidDate } = require("./dateUtils");

function isEmpty(value) {
  return !value || String(value).trim() === "";
}

function isEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function isPositiveNumber(num) {
  return typeof num === "number" && num > 0;
}

function validateEvent(eventData) {
  const errors = [];

  if (isEmpty(eventData.title)) errors.push("Title is required");
  if (isEmpty(eventData.description)) errors.push("Description is required");

  if (!isValidDate(eventData.date)) {
    errors.push("Invalid date");
  }

  if (!isPositiveNumber(eventData.capacity)) {
    errors.push("Capacity must be a positive number");
  }

  return {
    success: errors.length === 0,
    errors
  };
}

function validateRegistration(regData) {
  const errors = [];

  if (isEmpty(regData.name)) errors.push("Name is required");
  if (!isEmail(regData.email)) errors.push("Invalid email");
  if (isEmpty(regData.eventId)) errors.push("Event ID is required");

  return {
    success: errors.length === 0,
    errors
  };
}

module.exports = {
  isEmpty,
  isEmail,
  isPositiveNumber,
  validateEvent,
  validateRegistration
};
