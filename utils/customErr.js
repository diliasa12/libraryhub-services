export const customErr = (message, statusCode) => {
  const err = new Error(message);
  err.status = statusCode;
  return err;
};
