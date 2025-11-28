function validateEvent(data) {
  if (!data.title || typeof data.title !== "string") {
    return "Title is required and must be a string.";
  }

  if (!data.startAt || isNaN(new Date(data.startAt))) {
    return "startAt is required and must be a valid date.";
  }

  if (!data.endAt || isNaN(new Date(data.endAt))) {
    return "endAt is required and must be a valid date.";
  }

  const start = new Date(data.startAt);
  const end = new Date(data.endAt);

  if (end <= start) {
    return "endAt must be later than startAt.";
  }

  if (data.capacity && (isNaN(data.capacity) || data.capacity <= 0)) {
    return "Capacity must be a positive number.";
  }

  return null;
}

function validateRegistration(data) {
  if (!data.userId) return "userId is required.";
  if (!data.eventId) return "eventId is required.";

  if (isNaN(Number(data.eventId))) return "eventId must be a number.";

  return null;
}

module.exports = {
  validateEvent,
  validateRegistration
};

