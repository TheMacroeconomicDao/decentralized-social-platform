class TokenExpiredError extends Error {
  status: number;

  constructor(errorText = 'Invalid Bearer token provided. Please provide a valid access token.') {
    super(errorText);
    this.name = 'TokenExpiredError';
    this.status = 401;
  }
}

export default TokenExpiredError;
