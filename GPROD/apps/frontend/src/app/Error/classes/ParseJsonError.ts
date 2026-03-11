class ParseJsonError extends Error {
  constructor(errorText = 'Parse JSON Error') {
    super(errorText);
    this.name = 'ParseJsonError';
  }
}

export default ParseJsonError;
