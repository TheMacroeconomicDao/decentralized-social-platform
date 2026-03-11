class NotJsonResponseError extends Error {
  constructor(errorText = 'Not JSON Response') {
    super(errorText);
    this.name = 'NotJsonResponseError';
  }
}

export default NotJsonResponseError;
