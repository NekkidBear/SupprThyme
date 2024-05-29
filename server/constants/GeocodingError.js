class GeocodingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeocodingError';
  }
}

module.exports = GeocodingError;