class UnknownResponseError extends Error {
  constructor(errorText = 'Unknown response from server') {
    super(errorText);
    this.name = 'UnknownResponseError';
  }
}

export default UnknownResponseError;
