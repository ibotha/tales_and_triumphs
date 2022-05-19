import { Document, Prisma } from "@prisma/client";
import { DMMF } from "@prisma/client/runtime";
import { GraphQLResolveInfo, SelectionSetNode } from "graphql";
import _, { property } from "lodash";
import { graphQLTypeMap } from "../schema";

const selectionMap: {
  [key: string]: {
    default: any;
  };
} = {
  DocumentSection: {
    default: {
      priority: true,
    },
  },
};

const dataModel = () => {
  const models: DMMF.Model[] = [];

  const { Prisma } = require("@prisma/client");
  if (Prisma.dmmf && Prisma.dmmf.datamodel) {
    models.push(...Prisma.dmmf.datamodel.models);
  }

  return models;
};

const generateSelectFromSelectionSet = (
  set: SelectionSetNode,
  parentType: string,
  fragmentMap: { [key: string]: SelectionSetNode }
) => {
  let ret: any = {};
  const models = dataModel().filter((m) => m.name === parentType);
  const model = models.length === 1 ? models[0] : null;
  const fields = model?.fields.map((f) => f.name);
  set.selections.forEach((selection) => {
    if (selection.kind === "Field" && selection.name.kind === "Name") {
      const name = selection.name.value;
      const type = graphQLTypeMap[parentType][selection.name.value];
      if (parentType in selectionMap) {
        ret = _.merge(ret, selectionMap[parentType].default);
      }

      if (selection.selectionSet) {
        if (fields?.includes(name))
          ret[name] = generateSelectFromSelectionSet(
            selection.selectionSet,
            type,
            fragmentMap
          );
      } else {
        if (fields?.includes(name)) ret[name] = true;
      }
    }
    if (selection.kind === "FragmentSpread") {
      _.merge(
        ret,
        generateSelectFromSelectionSet(
          fragmentMap[selection.name.value],
          parentType,
          fragmentMap
        ).select
      );
    }
  });
  return { select: ret };
};

type SelectionType =
  | "World"
  | "User"
  | "Template"
  | "Role"
  | "Document"
  | "Folder"
  | "AccessControl"
  | "DocumentSection"
  | "DocumentCategory"
  | "TextSection";

type SelectionDefaultsMap<T extends SelectionType> = T extends "World"
  ? Prisma.WorldSelect
  : T extends "User"
  ? Prisma.UserSelect
  : T extends "Role"
  ? Prisma.WorldRoleSelect
  : T extends "Document"
  ? Prisma.DocumentSelect
  : T extends "DocumentCategory"
  ? Prisma.DocumentCategorySelect
  : T extends "Folder"
  ? Prisma.FolderSelect
  : T extends "Template"
  ? Prisma.DocumentTemplateSelect
  : T extends "AccessControl"
  ? Prisma.ObjectAccessControlSelect
  : T extends "DocumentSection"
  ? Prisma.DocumentSectionSelect
  : T extends "TextSection"
  ? Prisma.TextSectionSelect
  : { id?: boolean };

type SelectionTypeMap<T extends SelectionType> = {
  [Property in keyof SelectionDefaultsMap<T>]-?: true;
};

export const generateSelection = <T extends SelectionType>(
  info: GraphQLResolveInfo,
  subFieldPath?: string,
  defaults?: SelectionDefaultsMap<T>
) => {
  let returnType = info.returnType.inspect().replaceAll(/[\[\]!]/g, "");
  let selectionSet = info.fieldNodes[0].selectionSet;
  if (subFieldPath) {
    const path = subFieldPath.split(".");
    for (let i = 0; i < path.length; i++) {
      const selection = selectionSet?.selections.filter(
        (s) => s.kind === "Field" && s.name.value === path[i]
      )[0];
      if (selection?.kind === "Field") {
        selectionSet = selection.selectionSet;
        returnType = graphQLTypeMap[returnType][selection.name.value];
      }
    }
  }
  const fragmentMap: { [key: string]: SelectionSetNode } = {};
  Object.keys(info.fragments).forEach((k) => {
    fragmentMap[k] = info.fragments[k].selectionSet;
  });
  defaults = defaults || ({} as SelectionDefaultsMap<T>);
  defaults.id = true;
  return _.merge(
    generateSelectFromSelectionSet(selectionSet!, returnType, fragmentMap),
    {
      select: defaults,
    }
  ) as {
    select: SelectionTypeMap<T>;
  };
};
