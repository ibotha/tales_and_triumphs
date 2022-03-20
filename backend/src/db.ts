export type UserModel = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  email?: string;
  pwHash?: string;
  createdWorlds?: WorldModel;
  roles?: WorldRoleModel;
  groups?: UserGroupModel;

  // Category Relations
  createdCategories?: DocumentCategoryModel;

  // Document relations
  createdDocuments?: DocumentModel;
  readOnlyDocuments?: DocumentModel;
  editableDocuments?: DocumentModel;

  // Folder relations
  createdFolders?: FolderModel;
  readOnlyFolders?: FolderModel;
  editableFolders?: FolderModel;

  // Document Template relations
  createdDocumentTemplates?: DocumentTemplateModel;
  rHgS5orgPvsuzJ7shn8vw28y1XaePY4uDP?: DocumentTemplateModel;
  editableDocumentTemplates?: DocumentTemplateModel;
};

export type WorldModel = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  creator?: UserModel;
  creatorId?: string;
  groups?: UserGroupModel;
  roles?: WorldRoleModel;
  categories?: DocumentCategoryModel;

  documents?: DocumentModel;
  folders?: FolderModel;
  documentTemplates?: DocumentTemplateModel;
};

export type WorldRoleModel = {
  id: string;
  user?: UserModel;
  userId?: string;
  level?: number;
  world?: WorldModel;
  worldId?: string;
};

export type UserGroupModel = {
  id: string;
  name?: string;
  world?: WorldModel;
  worldId?: string;
  users?: UserModel;
};

export type DocumentModel = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  mentions?: DocumentModel;
  mentionedIn?: DocumentModel;
  content?: string;
  name?: string;
  category?: DocumentCategoryModel;
  categoryId?: string;
  parentFolder?: FolderModel;
  parentFolderId?: string;

  // Access Control
  readAccessLevel?: 0 | 1 | 2 | 3;
  writeAccessLevel?: 0 | 1 | 2 | 3;
  world?: WorldModel;
  worldId?: string;
  creator?: UserModel;
  creatorId?: string;
  readOnly?: UserModel;
  edit?: UserModel;
};

export type DocumentCategoryModel = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  world?: WorldModel;
  worldId?: string;
  name?: string;
  colour?: string;
  documents?: DocumentModel;
  creator?: UserModel;
  creatorId?: string;
};

export type FolderModel = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  colour?: string;
  documents?: DocumentModel;
  subfolders?: FolderModel;
  parentFolder?: FolderModel;
  parentFolderId?: string;
  // Access Control
  readAccessLevel?: 0 | 1 | 2 | 3;
  writeAccessLevel?: 0 | 1 | 2 | 3;
  world?: WorldModel;
  worldId?: string;
  creator?: UserModel;
  creatorId?: string;
  readOnly?: UserModel;
  edit?: UserModel;
};

export type DocumentTemplateModel = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  content?: string;

  // Access Control
  readAccessLevel?: 0 | 1 | 2 | 3;
  writeAccessLevel?: 0 | 1 | 2 | 3;
  world?: WorldModel;
  worldId?: string;
  creator?: UserModel;
  creatorId?: string;
  readOnly?: UserModel;
  edit?: UserModel;
};
