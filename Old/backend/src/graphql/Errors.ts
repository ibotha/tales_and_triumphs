import {
  AllNexusOutputTypeDefs,
  GetGen,
  NexusMetaType,
  NexusObjectTypeDef,
  ObjectDefinitionBlock,
  objectType,
} from "nexus/dist/core";

type ErrorObjectTypeConfig<TypeName extends string> = {
  name: TypeName;
  definition?(t: ObjectDefinitionBlock<TypeName>): void;
  wrappedType:
    | GetGen<"allOutputTypes", string>
    | AllNexusOutputTypeDefs
    | NexusMetaType;
};

type ErrorObjectTypeDef<TypeName extends string> = {};

export const ErrorItem = objectType({
  name: "FieldErrorItem",
  definition(t) {
    t.nonNull.string("field");
    t.nonNull.string("message");
  },
});

export function generateErrorType<TypeName extends string>(
  config: ErrorObjectTypeConfig<TypeName>
): NexusObjectTypeDef<TypeName> {
  return objectType({
    name: config.name,
    definition(t) {
      t.list.nonNull.field("fieldErrors", {
        type: "FieldErrorItem",
        resolve(parent) {
          return parent.fieldErrors;
        },
      });
      t.list.nonNull.field("errors", {
        type: "String",
        resolve(parent) {
          return parent.errors;
        },
      });
      t.field("data", {
        type: config.wrappedType,
        resolve(parent) {
          return parent.data;
        },
      });
      if (config.definition) config.definition(t);
    },
  });
}
