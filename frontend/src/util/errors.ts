export const convertFieldErrors = (
  errors: { field: string; message: string }[]
) => {
  const ret: { [key: string]: string[] } = {};
  errors.forEach((err) => {
    if (!ret[err.field]) ret[err.field] = [err.message];
    else ret[err.field] = ret[err.field].concat([err.message]);
  });
  return ret;
};
