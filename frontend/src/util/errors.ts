export const convertFieldErrors = (
  errors: { field: string; message: string }[]
) => {
  const ret: { [key: string]: string[] } = {};
  errors.forEach((err) => {
    const key = err.field;
    if (!ret[key]) ret[key] = [err.message];
    else ret[key] = ret[key]!.concat([err.message]);
  });
  return ret;
};
