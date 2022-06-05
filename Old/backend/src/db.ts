import { Prisma, User, World, WorldRole } from "@prisma/client";

type GenericConvert<T, C> = T extends unknown[] ? C[] : C;
type GenericMaybeArray<T> = T | T[];

type ModelMap<T> = T extends GenericMaybeArray<User>
  ? GenericConvert<T, UserModel>
  : T extends GenericMaybeArray<World>
  ? GenericConvert<T, WorldModel>
  : T extends GenericMaybeArray<WorldRole>
  ? GenericConvert<T, WorldRoleModel>
  : T;

type GenericModel<T> = { id: string } & {
  [Property in keyof T]?: ModelMap<T[Property]>;
};

export type UserModel = GenericModel<
  Prisma.UserGetPayload<{
    include: {
      [Property in keyof Prisma.UserInclude]-?: true;
    };
  }>
>;

export type WorldModel = GenericModel<
  Prisma.WorldGetPayload<{
    include: {
      [Property in keyof Prisma.WorldInclude]-?: true;
    };
  }>
>;

export type WorldRoleModel = GenericModel<
  Prisma.WorldRoleGetPayload<{
    include: {
      [Property in keyof Prisma.WorldRoleInclude]-?: true;
    };
  }>
>;

export type UserGroupModel = GenericModel<
  Prisma.UserGroupGetPayload<{
    include: {
      [Property in keyof Prisma.UserGroupInclude]-?: true;
    };
  }>
>;

export type DocumentModel = GenericModel<
  Prisma.DocumentGetPayload<{
    include: {
      [Property in keyof Prisma.DocumentInclude]-?: true;
    };
  }>
>;

export type DocumentCategoryModel = GenericModel<
  Prisma.DocumentCategoryGetPayload<{
    include: {
      [Property in keyof Prisma.DocumentCategoryInclude]-?: true;
    };
  }>
>;

export type FolderModel = GenericModel<
  Prisma.FolderGetPayload<{
    include: {
      [Property in keyof Prisma.FolderInclude]-?: true;
    };
  }>
>;

export type DocumentTemplateModel = GenericModel<
  Prisma.DocumentTemplateGetPayload<{
    include: {
      [Property in keyof Prisma.DocumentTemplateInclude]-?: true;
    };
  }>
>;

export type ObjectAccessControlModel = GenericModel<
  Prisma.ObjectAccessControlGetPayload<{
    include: {
      [Property in keyof Prisma.ObjectAccessControlInclude]-?: true;
    };
  }>
>;

export type DocumentSectionModel = GenericModel<
  Prisma.DocumentSectionGetPayload<{
    include: {
      [Property in keyof Prisma.DocumentSectionInclude]-?: true;
    };
  }>
>;

export type TextSectionModel = GenericModel<
  Prisma.TextSectionGetPayload<{
    include: {
      [Property in keyof Prisma.TextSectionInclude]-?: true;
    };
  }>
>;
