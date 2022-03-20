import { PrismaSelect } from "@paljs/plugins";
import { Prisma } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";

export function generateSelect<T extends { [key: string]: any }>(): {
  <D extends T>(
    i: GraphQLResolveInfo,
    defaults: D,
    valueOf?: string,
    exclude?: string[]
  ): {
    select: D & T;
  };
} {
  return NewTag_Internal;
}

function NewTag_Internal(
  info: GraphQLResolveInfo,
  defaults: any,
  valueOf?: string,
  exclude?: string[]
) {
  let select = valueOf
    ? new PrismaSelect(info, {
        defaultFields: { select: defaults },
      }).valueOf(valueOf)
    : new PrismaSelect(info, {
        defaultFields: { select: defaults },
      }).value;
  exclude?.forEach((element) => {
    select.select[element] = undefined;
  });
  return select;
}
