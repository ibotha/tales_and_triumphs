export type stronglyTypedObject<I> = { [key: string]: I };

export const mapObject = <
  T extends stronglyTypedObject<any>,
  R extends { [Property in keyof T]: U },
  U
>(
  object: T,
  action: (input: T extends stronglyTypedObject<infer I> ? I : never) => U
): R => {
  const newObj: R = {} as unknown as R;
  Object.keys(object).forEach((key) => {
    newObj[key as keyof R] = action(object[key as keyof T]) as R[keyof T];
  });
  return newObj;
};
