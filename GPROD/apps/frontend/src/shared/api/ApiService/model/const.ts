export enum ErrorResponseStatus {
  fields = 422,
  conflict = 409, // The username is already taken
  tooManyRequests = 429, // snackbar
}