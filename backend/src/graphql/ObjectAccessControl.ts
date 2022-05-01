import {
  arg,
  enumType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import {
  getUserAccessLevelOnObjectAccessControl,
  userHasAccessLevelOnObjectAccessControl,
} from "../Auth/worldAuth";
import { eObjectPermission, eObjectTypes } from "../types";
import { generateSelection } from "../Util/select";

export const ObjectTypeEnum = enumType({
  name: "ObjectType",
  members: eObjectTypes,
});

export const ObjectAccessControl = objectType({
  name: "ObjectAccessControl",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.list.nonNull.field("edit", { type: "User" });
    t.nonNull.list.nonNull.field("readOnly", { type: "User" });
    t.nonNull.field("readAccessLevel", { type: "RoleLevel" });
    t.nonNull.field("writeAccessLevel", { type: "RoleLevel" });
    t.nonNull.boolean("editable", {
      resolve: async (parent, _, context) => {
        return (
          (await getUserAccessLevelOnObjectAccessControl(
            parent.id,
            context
          )) === eObjectPermission.WRITE
        );
      },
    });
  },
});

export const AccessControlMutation = mutationField((t) => {
  t.field("updateAccessControl", {
    type: "ObjectAccessControl",
    args: {
      id: nonNull(stringArg()),
      revokeUsers: list(nonNull(stringArg())),
      newReadOnlyUsers: list(nonNull(stringArg())),
      newEditorUsers: list(nonNull(stringArg())),
      readAccessLevel: arg({ type: "RoleLevel" }),
      writeAccessLevel: arg({ type: "RoleLevel" }),
    },
    resolve: async (
      parent,
      {
        id,
        revokeUsers,
        newEditorUsers,
        newReadOnlyUsers,
        readAccessLevel,
        writeAccessLevel,
      },
      context,
      info
    ) => {
      if (
        !(await userHasAccessLevelOnObjectAccessControl(
          id,
          context,
          eObjectPermission.WRITE
        ))
      )
        throw new Error("Insufficient Permissions.");
      let select = generateSelection<"AccessControl">(info);

      let editRevokeList: { id: string }[] = [];
      let editConnectList: { id: string }[] = [];
      let readOnlyRevokeList: { id: string }[] = [];
      let readOnlyConnectList: { id: string }[] = [];
      if (revokeUsers) {
        editRevokeList = editRevokeList.concat(
          revokeUsers.map((e) => ({ id: e }))
        );
        readOnlyRevokeList = readOnlyRevokeList.concat(
          revokeUsers.map((e) => ({ id: e }))
        );
      }

      if (newEditorUsers) {
        editConnectList = editConnectList.concat(
          newEditorUsers.map((e) => ({ id: e }))
        );
        readOnlyRevokeList = readOnlyRevokeList.concat(
          newEditorUsers.map((e) => ({ id: e }))
        );
      }

      if (newReadOnlyUsers) {
        editRevokeList = editRevokeList.concat(
          newReadOnlyUsers.map((e) => ({ id: e }))
        );
        readOnlyConnectList = readOnlyConnectList.concat(
          newReadOnlyUsers.map((e) => ({ id: e }))
        );
      }

      let ret = await context.prisma.objectAccessControl.update({
        where: { id },
        data: {
          readAccessLevel:
            readAccessLevel === null || readAccessLevel === undefined
              ? undefined
              : readAccessLevel,
          writeAccessLevel:
            writeAccessLevel === null || writeAccessLevel === undefined
              ? undefined
              : writeAccessLevel,
          edit: { disconnect: editRevokeList, connect: editConnectList },
          readOnly: {
            disconnect: readOnlyRevokeList,
            connect: readOnlyConnectList,
          },
        },
        ...select,
      });
      return ret;
    },
  });
});

export const ObjectAccessControlQuery = queryField((t) => {
  t.field("objectAccessControl", {
    type: "ObjectAccessControl",
    args: {
      id: nonNull(stringArg()),
    },
    resolve(parent, { id }, context, info) {
      let select = generateSelection<"AccessControl">(info);
      return context.prisma.objectAccessControl.findUnique({
        where: { id },
        ...select,
      });
    },
  });
});
