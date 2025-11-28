function toISO(date) {
  if (!date) return null;

  try {
    return new Date(date).toISOString();
  } catch (e) {
    return null;
  }
}

module.exports = { toISO };
