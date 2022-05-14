import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AssignmentPayload = {
  __typename?: 'AssignmentPayload';
  data?: Maybe<WorldRole>;
  errors?: Maybe<Array<Scalars['String']>>;
  fieldErrors?: Maybe<Array<FieldErrorItem>>;
};

export type Document = {
  __typename?: 'Document';
  category?: Maybe<DocumentCategory>;
  creator?: Maybe<User>;
  id: Scalars['ID'];
  name: Scalars['String'];
  objectAccessControl: ObjectAccessControl;
  parentFolder?: Maybe<Folder>;
  sections: Array<DocumentSection>;
  world: World;
};

export type DocumentCategory = {
  __typename?: 'DocumentCategory';
  colour: Scalars['String'];
  creator?: Maybe<User>;
  creatorId?: Maybe<Scalars['ID']>;
  documents: Array<Document>;
  id: Scalars['ID'];
  name: Scalars['String'];
  world: World;
  worldId: Scalars['ID'];
};

export type DocumentSection = {
  __typename?: 'DocumentSection';
  document: Document;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  objectAccessControl: ObjectAccessControl;
  textSection?: Maybe<TextSection>;
  type?: Maybe<SectionType>;
};

export type DocumentTemplate = {
  __typename?: 'DocumentTemplate';
  content: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  objectAccessControl: ObjectAccessControl;
};

export type DocumentWrapper = {
  __typename?: 'DocumentWrapper';
  data?: Maybe<Document>;
  errors?: Maybe<Array<Scalars['String']>>;
  fieldErrors?: Maybe<Array<FieldErrorItem>>;
};

export type FieldErrorItem = {
  __typename?: 'FieldErrorItem';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Folder = {
  __typename?: 'Folder';
  colour: Scalars['String'];
  creator?: Maybe<User>;
  documents: Array<Document>;
  id: Scalars['ID'];
  name: Scalars['String'];
  objectAccessControl: ObjectAccessControl;
  parentFolder?: Maybe<Folder>;
  parentFolderId?: Maybe<Scalars['String']>;
  subfolders: Array<Folder>;
  world: World;
  worldId?: Maybe<Scalars['String']>;
};

export type FolderWrapper = {
  __typename?: 'FolderWrapper';
  data?: Maybe<Folder>;
  errors?: Maybe<Array<Scalars['String']>>;
  fieldErrors?: Maybe<Array<FieldErrorItem>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  assignWorldRole?: Maybe<AssignmentPayload>;
  createDocument?: Maybe<DocumentWrapper>;
  createDocumentTemplate?: Maybe<DocumentTemplate>;
  createFolder?: Maybe<FolderWrapper>;
  createTextSection?: Maybe<TextSection>;
  createWorld?: Maybe<WorldWrapper>;
  deleteDocument?: Maybe<Document>;
  deleteDocumentSection?: Maybe<DocumentSection>;
  deleteDocumentTemplate?: Maybe<Scalars['Boolean']>;
  deleteFolder?: Maybe<Folder>;
  deleteWorld?: Maybe<World>;
  login?: Maybe<UserPayload>;
  logout?: Maybe<Scalars['Boolean']>;
  reOrderSection?: Maybe<DocumentSection>;
  register?: Maybe<UserPayload>;
  updateAccessControl?: Maybe<ObjectAccessControl>;
  updateDocument?: Maybe<Document>;
  updateDocumentSection?: Maybe<DocumentSection>;
  updateDocumentTemplate?: Maybe<DocumentTemplate>;
  updateFolder?: Maybe<Folder>;
  updateTextSection?: Maybe<TextSection>;
  updateUser?: Maybe<UserPayload>;
};


export type MutationAssignWorldRoleArgs = {
  level?: InputMaybe<RoleLevel>;
  userEmail?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  worldId: Scalars['String'];
};


export type MutationCreateDocumentArgs = {
  categoryId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  parentFolderId?: InputMaybe<Scalars['String']>;
  worldId: Scalars['String'];
};


export type MutationCreateDocumentTemplateArgs = {
  content: Scalars['String'];
  name: Scalars['String'];
  worldId: Scalars['String'];
};


export type MutationCreateFolderArgs = {
  colour?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  parentFolderId: Scalars['String'];
  worldId: Scalars['String'];
};


export type MutationCreateTextSectionArgs = {
  documentId: Scalars['String'];
};


export type MutationCreateWorldArgs = {
  name: Scalars['String'];
};


export type MutationDeleteDocumentArgs = {
  id: Scalars['String'];
};


export type MutationDeleteDocumentSectionArgs = {
  sectionId: Scalars['String'];
};


export type MutationDeleteDocumentTemplateArgs = {
  id: Scalars['String'];
};


export type MutationDeleteFolderArgs = {
  id: Scalars['String'];
};


export type MutationDeleteWorldArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationReOrderSectionArgs = {
  index: Scalars['Int'];
  sectionId: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdateAccessControlArgs = {
  id: Scalars['String'];
  newEditorUsers?: InputMaybe<Array<Scalars['String']>>;
  newReadOnlyUsers?: InputMaybe<Array<Scalars['String']>>;
  readAccessLevel?: InputMaybe<RoleLevel>;
  revokeUsers?: InputMaybe<Array<Scalars['String']>>;
  writeAccessLevel?: InputMaybe<RoleLevel>;
};


export type MutationUpdateDocumentArgs = {
  categoryId?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  parentFolderId?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateDocumentSectionArgs = {
  id: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateDocumentTemplateArgs = {
  content?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateFolderArgs = {
  colour?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  parentFolderId?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateTextSectionArgs = {
  content?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  newPassword?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type ObjectAccessControl = {
  __typename?: 'ObjectAccessControl';
  edit: Array<User>;
  editable: Scalars['Boolean'];
  id: Scalars['ID'];
  readAccessLevel: RoleLevel;
  readOnly: Array<User>;
  writeAccessLevel: RoleLevel;
};

export enum ObjectType {
  Document = 'Document',
  DocumentTemplate = 'DocumentTemplate',
  Folder = 'Folder',
  Section = 'Section'
}

export type PermissionItem = {
  __typename?: 'PermissionItem';
  id: Scalars['ID'];
  type: PermissionItemType;
};

export type PermissionItemInput = {
  id: Scalars['ID'];
  type: PermissionItemType;
};

export enum PermissionItemType {
  Document = 'DOCUMENT',
  DocumentTemplate = 'DOCUMENT_TEMPLATE',
  Folder = 'FOLDER'
}

export type Permissions = {
  __typename?: 'Permissions';
  accessLevel: RoleLevel;
  id?: Maybe<Scalars['ID']>;
  item: PermissionItem;
  userAccessLevels: Array<UserPermission>;
};

export type Query = {
  __typename?: 'Query';
  document?: Maybe<Document>;
  documentCategories: Array<DocumentCategory>;
  documentSection?: Maybe<DocumentSection>;
  documentTemplate?: Maybe<DocumentTemplate>;
  documentTemplates: Array<DocumentTemplate>;
  documents: Array<Document>;
  folder?: Maybe<Folder>;
  folders: Array<Folder>;
  me?: Maybe<User>;
  myWorlds?: Maybe<Array<World>>;
  objectAccessControl?: Maybe<ObjectAccessControl>;
  textSection?: Maybe<TextSection>;
  users: Array<User>;
  world?: Maybe<World>;
  worlds: Array<World>;
};


export type QueryDocumentArgs = {
  id: Scalars['String'];
};


export type QueryDocumentCategoriesArgs = {
  worldId: Scalars['String'];
};


export type QueryDocumentSectionArgs = {
  id: Scalars['String'];
};


export type QueryDocumentTemplateArgs = {
  id: Scalars['String'];
};


export type QueryDocumentTemplatesArgs = {
  worldId: Scalars['String'];
};


export type QueryDocumentsArgs = {
  nameFilter: Scalars['String'];
  worldId: Scalars['String'];
};


export type QueryFolderArgs = {
  id: Scalars['String'];
};


export type QueryFoldersArgs = {
  nameFilter: Scalars['String'];
  worldId: Scalars['String'];
};


export type QueryObjectAccessControlArgs = {
  id: Scalars['String'];
};


export type QueryTextSectionArgs = {
  id: Scalars['String'];
};


export type QueryWorldArgs = {
  id: Scalars['String'];
};

export enum RoleLevel {
  Admin = 'ADMIN',
  Public = 'PUBLIC',
  Trusted = 'TRUSTED',
  User = 'USER'
}

export enum SectionType {
  Text = 'Text'
}

export type TextSection = {
  __typename?: 'TextSection';
  content: Scalars['String'];
  id: Scalars['ID'];
  section: DocumentSection;
};

export type User = {
  __typename?: 'User';
  createdWorlds: Array<World>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  roles: Array<WorldRole>;
  username: Scalars['String'];
};

export enum UserAccessLevel {
  Read = 'READ',
  Write = 'WRITE'
}

export type UserPayload = {
  __typename?: 'UserPayload';
  data?: Maybe<User>;
  errors?: Maybe<Array<Scalars['String']>>;
  fieldErrors?: Maybe<Array<FieldErrorItem>>;
};

export type UserPermission = {
  __typename?: 'UserPermission';
  accessLevel?: Maybe<UserAccessLevel>;
  id: Scalars['ID'];
};

export type UserPermissionInput = {
  accessLevel?: InputMaybe<UserAccessLevel>;
  id: Scalars['ID'];
};

export type World = {
  __typename?: 'World';
  categories: Array<DocumentCategory>;
  id: Scalars['ID'];
  myRole?: Maybe<RoleLevel>;
  name: Scalars['String'];
  roles: Array<WorldRole>;
  rootFolder?: Maybe<Folder>;
};

export type WorldRole = {
  __typename?: 'WorldRole';
  id: Scalars['ID'];
  level: RoleLevel;
  user: User;
  world: World;
};

export type WorldWrapper = {
  __typename?: 'WorldWrapper';
  data?: Maybe<World>;
  errors?: Maybe<Array<Scalars['String']>>;
  fieldErrors?: Maybe<Array<FieldErrorItem>>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'UserPayload', fieldErrors?: Array<{ __typename?: 'FieldErrorItem', field: string, message: string }> | null } | null };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'UserPayload', errors?: Array<string> | null, data?: { __typename?: 'User', id: string, username: string, email?: string | null } | null, fieldErrors?: Array<{ __typename?: 'FieldErrorItem', field: string, message: string }> | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: boolean | null };

export type MoveDocumentMutationVariables = Exact<{
  documentId: Scalars['String'];
  parentFolderId: Scalars['String'];
}>;


export type MoveDocumentMutation = { __typename?: 'Mutation', updateDocument?: { __typename?: 'Document', id: string, parentFolder?: { __typename?: 'Folder', id: string } | null } | null };

export type CreateDocumentMutationVariables = Exact<{
  name: Scalars['String'];
  parentFolderId: Scalars['String'];
  worldId: Scalars['String'];
}>;


export type CreateDocumentMutation = { __typename?: 'Mutation', createDocument?: { __typename?: 'DocumentWrapper', errors?: Array<string> | null, data?: { __typename?: 'Document', id: string, name: string } | null, fieldErrors?: Array<{ __typename?: 'FieldErrorItem', field: string, message: string }> | null } | null };

export type DeleteDocumentMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteDocumentMutation = { __typename?: 'Mutation', deleteDocument?: { __typename?: 'Document', id: string } | null };

export type CreateTextSectionMutationVariables = Exact<{
  documentId: Scalars['String'];
}>;


export type CreateTextSectionMutation = { __typename?: 'Mutation', createTextSection?: { __typename?: 'TextSection', id: string, section: { __typename?: 'DocumentSection', id: string, document: { __typename?: 'Document', id: string, sections: Array<{ __typename?: 'DocumentSection', id: string }> } } } | null };

export type DeleteDocumentSectionMutationVariables = Exact<{
  sectionId: Scalars['String'];
}>;


export type DeleteDocumentSectionMutation = { __typename?: 'Mutation', deleteDocumentSection?: { __typename?: 'DocumentSection', id: string, document: { __typename?: 'Document', id: string, sections: Array<{ __typename?: 'DocumentSection', id: string }> } } | null };

export type UpdateDocumentMutationVariables = Exact<{
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
}>;


export type UpdateDocumentMutation = { __typename?: 'Mutation', updateDocument?: { __typename?: 'Document', id: string, name: string } | null };

export type BasicDocumentFragment = { __typename?: 'Document', id: string, name: string, parentFolder?: { __typename?: 'Folder', id: string } | null, objectAccessControl: { __typename?: 'ObjectAccessControl', editable: boolean, id: string }, sections: Array<{ __typename?: 'DocumentSection', id: string }>, world: { __typename?: 'World', id: string } };

export type DocumentQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type DocumentQuery = { __typename?: 'Query', document?: { __typename?: 'Document', id: string, name: string, parentFolder?: { __typename?: 'Folder', id: string } | null, objectAccessControl: { __typename?: 'ObjectAccessControl', editable: boolean, id: string }, sections: Array<{ __typename?: 'DocumentSection', id: string }>, world: { __typename?: 'World', id: string } } | null };

export type DocumentSectionQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type DocumentSectionQuery = { __typename?: 'Query', documentSection?: { __typename?: 'DocumentSection', id: string, type?: SectionType | null, name?: string | null, textSection?: { __typename?: 'TextSection', id: string } | null, objectAccessControl: { __typename?: 'ObjectAccessControl', id: string } } | null };

export type MoveFolderMutationVariables = Exact<{
  folderId: Scalars['String'];
  parentFolderId: Scalars['String'];
}>;


export type MoveFolderMutation = { __typename?: 'Mutation', updateFolder?: { __typename?: 'Folder', id: string, parentFolder?: { __typename?: 'Folder', id: string } | null } | null };

export type DeleteFolderMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteFolderMutation = { __typename?: 'Mutation', deleteFolder?: { __typename?: 'Folder', id: string, parentFolder?: { __typename?: 'Folder', id: string } | null } | null };

export type CreateFolderMutationVariables = Exact<{
  name: Scalars['String'];
  parentFolderId: Scalars['String'];
  worldId: Scalars['String'];
}>;


export type CreateFolderMutation = { __typename?: 'Mutation', createFolder?: { __typename?: 'FolderWrapper', errors?: Array<string> | null, data?: { __typename?: 'Folder', id: string, name: string } | null, fieldErrors?: Array<{ __typename?: 'FieldErrorItem', field: string, message: string }> | null } | null };

export type UpdateFolderMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  colour?: InputMaybe<Scalars['String']>;
}>;


export type UpdateFolderMutation = { __typename?: 'Mutation', updateFolder?: { __typename?: 'Folder', id: string, name: string, colour: string } | null };

export type FolderContentsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type FolderContentsQuery = { __typename?: 'Query', folder?: { __typename?: 'Folder', id: string, name: string, colour: string, documents: Array<{ __typename?: 'Document', id: string, name: string }>, subfolders: Array<{ __typename?: 'Folder', id: string, name: string }> } | null };

export type FolderQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type FolderQuery = { __typename?: 'Query', folder?: { __typename?: 'Folder', id: string, name: string, colour: string, parentFolder?: { __typename?: 'Folder', id: string } | null, documents: Array<{ __typename?: 'Document', id: string, name: string }>, subfolders: Array<{ __typename?: 'Folder', id: string, name: string, colour: string }>, objectAccessControl: { __typename?: 'ObjectAccessControl', editable: boolean, id: string } } | null };

export type AssignUserRoleMutationVariables = Exact<{
  email: Scalars['String'];
  worldId: Scalars['String'];
  level?: InputMaybe<RoleLevel>;
}>;


export type AssignUserRoleMutation = { __typename?: 'Mutation', assignWorldRole?: { __typename?: 'AssignmentPayload', errors?: Array<string> | null, data?: { __typename?: 'WorldRole', id: string, level: RoleLevel } | null, fieldErrors?: Array<{ __typename?: 'FieldErrorItem', field: string, message: string }> | null } | null };

export type UpdatePermissionsMutationVariables = Exact<{
  objectAccessControlId: Scalars['String'];
  writeAccessLevel?: InputMaybe<RoleLevel>;
  readAccessLevel?: InputMaybe<RoleLevel>;
  newEditorUsers?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  newReadOnlyUsers?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  revokeUsers?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type UpdatePermissionsMutation = { __typename?: 'Mutation', updateAccessControl?: { __typename?: 'ObjectAccessControl', id: string, writeAccessLevel: RoleLevel, readAccessLevel: RoleLevel, edit: Array<{ __typename?: 'User', id: string, username: string }>, readOnly: Array<{ __typename?: 'User', id: string, username: string }> } | null };

export type PermissionsQueryVariables = Exact<{
  objectAccessControlId: Scalars['String'];
  worldId: Scalars['String'];
}>;


export type PermissionsQuery = { __typename?: 'Query', objectAccessControl?: { __typename?: 'ObjectAccessControl', id: string, writeAccessLevel: RoleLevel, readAccessLevel: RoleLevel, editable: boolean, edit: Array<{ __typename?: 'User', id: string, username: string }>, readOnly: Array<{ __typename?: 'User', id: string, username: string }> } | null, world?: { __typename?: 'World', id: string, roles: Array<{ __typename?: 'WorldRole', id: string, user: { __typename?: 'User', id: string, username: string } }> } | null };

export type RootFolderQueryVariables = Exact<{
  worldId: Scalars['String'];
}>;


export type RootFolderQuery = { __typename?: 'Query', world?: { __typename?: 'World', id: string, rootFolder?: { __typename?: 'Folder', id: string } | null } | null };

export type TextSectionQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TextSectionQuery = { __typename?: 'Query', textSection?: { __typename?: 'TextSection', id: string, content: string } | null };

export type UpdateTextSectionMutationVariables = Exact<{
  id: Scalars['String'];
  content?: InputMaybe<Scalars['String']>;
}>;


export type UpdateTextSectionMutation = { __typename?: 'Mutation', updateTextSection?: { __typename?: 'TextSection', id: string, content: string } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string } | null };

export type WorldQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type WorldQuery = { __typename?: 'Query', world?: { __typename?: 'World', id: string, name: string, myRole?: RoleLevel | null, roles: Array<{ __typename?: 'WorldRole', id: string, level: RoleLevel, user: { __typename?: 'User', id: string, username: string } }>, rootFolder?: { __typename?: 'Folder', id: string } | null } | null };

export type DeleteWorldMutationVariables = Exact<{
  worldId: Scalars['String'];
}>;


export type DeleteWorldMutation = { __typename?: 'Mutation', deleteWorld?: { __typename?: 'World', id: string } | null };

export type MyWorldsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyWorldsQuery = { __typename?: 'Query', myWorlds?: Array<{ __typename?: 'World', id: string }> | null };

export type CreateWorldMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateWorldMutation = { __typename?: 'Mutation', createWorld?: { __typename?: 'WorldWrapper', errors?: Array<string> | null, data?: { __typename?: 'World', id: string, name: string } | null, fieldErrors?: Array<{ __typename?: 'FieldErrorItem', field: string, message: string }> | null } | null };

export type FolderAndDocumentSuggestionsQueryVariables = Exact<{
  nameFilter: Scalars['String'];
  worldId: Scalars['String'];
}>;


export type FolderAndDocumentSuggestionsQuery = { __typename?: 'Query', folders: Array<{ __typename?: 'Folder', id: string, name: string }>, documents: Array<{ __typename?: 'Document', id: string, name: string }> };

export const BasicDocumentFragmentDoc = gql`
    fragment BasicDocument on Document {
  id
  name
  parentFolder {
    id
  }
  objectAccessControl {
    editable
    id
  }
  sections {
    id
  }
  world {
    id
  }
}
    `;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    fieldErrors {
      field
      message
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $username: String!) {
  register(email: $email, password: $password, username: $username) {
    data {
      id
      username
      email
    }
    errors
    fieldErrors {
      field
      message
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const MoveDocumentDocument = gql`
    mutation moveDocument($documentId: String!, $parentFolderId: String!) {
  updateDocument(id: $documentId, parentFolderId: $parentFolderId) {
    id
    parentFolder {
      id
    }
  }
}
    `;

export function useMoveDocumentMutation() {
  return Urql.useMutation<MoveDocumentMutation, MoveDocumentMutationVariables>(MoveDocumentDocument);
};
export const CreateDocumentDocument = gql`
    mutation CreateDocument($name: String!, $parentFolderId: String!, $worldId: String!) {
  createDocument(name: $name, parentFolderId: $parentFolderId, worldId: $worldId) {
    data {
      id
      name
    }
    errors
    fieldErrors {
      field
      message
    }
  }
}
    `;

export function useCreateDocumentMutation() {
  return Urql.useMutation<CreateDocumentMutation, CreateDocumentMutationVariables>(CreateDocumentDocument);
};
export const DeleteDocumentDocument = gql`
    mutation DeleteDocument($id: String!) {
  deleteDocument(id: $id) {
    id
  }
}
    `;

export function useDeleteDocumentMutation() {
  return Urql.useMutation<DeleteDocumentMutation, DeleteDocumentMutationVariables>(DeleteDocumentDocument);
};
export const CreateTextSectionDocument = gql`
    mutation CreateTextSection($documentId: String!) {
  createTextSection(documentId: $documentId) {
    id
    section {
      id
      document {
        id
        sections {
          id
        }
      }
    }
  }
}
    `;

export function useCreateTextSectionMutation() {
  return Urql.useMutation<CreateTextSectionMutation, CreateTextSectionMutationVariables>(CreateTextSectionDocument);
};
export const DeleteDocumentSectionDocument = gql`
    mutation DeleteDocumentSection($sectionId: String!) {
  deleteDocumentSection(sectionId: $sectionId) {
    id
    document {
      id
      sections {
        id
      }
    }
  }
}
    `;

export function useDeleteDocumentSectionMutation() {
  return Urql.useMutation<DeleteDocumentSectionMutation, DeleteDocumentSectionMutationVariables>(DeleteDocumentSectionDocument);
};
export const UpdateDocumentDocument = gql`
    mutation UpdateDocument($id: String!, $name: String) {
  updateDocument(id: $id, name: $name) {
    id
    name
  }
}
    `;

export function useUpdateDocumentMutation() {
  return Urql.useMutation<UpdateDocumentMutation, UpdateDocumentMutationVariables>(UpdateDocumentDocument);
};
export const DocumentDocument = gql`
    query Document($id: String!) {
  document(id: $id) {
    ...BasicDocument
  }
}
    ${BasicDocumentFragmentDoc}`;

export function useDocumentQuery(options: Omit<Urql.UseQueryArgs<DocumentQueryVariables>, 'query'>) {
  return Urql.useQuery<DocumentQuery>({ query: DocumentDocument, ...options });
};
export const DocumentSectionDocument = gql`
    query DocumentSection($id: String!) {
  documentSection(id: $id) {
    id
    type
    name
    textSection {
      id
    }
    objectAccessControl {
      id
    }
  }
}
    `;

export function useDocumentSectionQuery(options: Omit<Urql.UseQueryArgs<DocumentSectionQueryVariables>, 'query'>) {
  return Urql.useQuery<DocumentSectionQuery>({ query: DocumentSectionDocument, ...options });
};
export const MoveFolderDocument = gql`
    mutation moveFolder($folderId: String!, $parentFolderId: String!) {
  updateFolder(id: $folderId, parentFolderId: $parentFolderId) {
    id
    parentFolder {
      id
    }
  }
}
    `;

export function useMoveFolderMutation() {
  return Urql.useMutation<MoveFolderMutation, MoveFolderMutationVariables>(MoveFolderDocument);
};
export const DeleteFolderDocument = gql`
    mutation DeleteFolder($id: String!) {
  deleteFolder(id: $id) {
    id
    parentFolder {
      id
    }
  }
}
    `;

export function useDeleteFolderMutation() {
  return Urql.useMutation<DeleteFolderMutation, DeleteFolderMutationVariables>(DeleteFolderDocument);
};
export const CreateFolderDocument = gql`
    mutation CreateFolder($name: String!, $parentFolderId: String!, $worldId: String!) {
  createFolder(name: $name, parentFolderId: $parentFolderId, worldId: $worldId) {
    data {
      id
      name
    }
    errors
    fieldErrors {
      field
      message
    }
  }
}
    `;

export function useCreateFolderMutation() {
  return Urql.useMutation<CreateFolderMutation, CreateFolderMutationVariables>(CreateFolderDocument);
};
export const UpdateFolderDocument = gql`
    mutation UpdateFolder($name: String, $id: String!, $colour: String) {
  updateFolder(name: $name, id: $id, colour: $colour) {
    id
    name
    colour
  }
}
    `;

export function useUpdateFolderMutation() {
  return Urql.useMutation<UpdateFolderMutation, UpdateFolderMutationVariables>(UpdateFolderDocument);
};
export const FolderContentsDocument = gql`
    query FolderContents($id: String!) {
  folder(id: $id) {
    id
    name
    colour
    documents {
      id
      name
    }
    subfolders {
      id
      name
    }
  }
}
    `;

export function useFolderContentsQuery(options: Omit<Urql.UseQueryArgs<FolderContentsQueryVariables>, 'query'>) {
  return Urql.useQuery<FolderContentsQuery>({ query: FolderContentsDocument, ...options });
};
export const FolderDocument = gql`
    query Folder($id: String!) {
  folder(id: $id) {
    id
    name
    colour
    parentFolder {
      id
    }
    documents {
      id
      name
    }
    subfolders {
      id
      name
      colour
    }
    objectAccessControl {
      editable
      id
    }
  }
}
    `;

export function useFolderQuery(options: Omit<Urql.UseQueryArgs<FolderQueryVariables>, 'query'>) {
  return Urql.useQuery<FolderQuery>({ query: FolderDocument, ...options });
};
export const AssignUserRoleDocument = gql`
    mutation AssignUserRole($email: String!, $worldId: String!, $level: RoleLevel) {
  assignWorldRole(worldId: $worldId, userEmail: $email, level: $level) {
    data {
      id
      level
    }
    errors
    fieldErrors {
      field
      message
    }
  }
}
    `;

export function useAssignUserRoleMutation() {
  return Urql.useMutation<AssignUserRoleMutation, AssignUserRoleMutationVariables>(AssignUserRoleDocument);
};
export const UpdatePermissionsDocument = gql`
    mutation UpdatePermissions($objectAccessControlId: String!, $writeAccessLevel: RoleLevel, $readAccessLevel: RoleLevel, $newEditorUsers: [String!], $newReadOnlyUsers: [String!], $revokeUsers: [String!]) {
  updateAccessControl(
    id: $objectAccessControlId
    writeAccessLevel: $writeAccessLevel
    readAccessLevel: $readAccessLevel
    newEditorUsers: $newEditorUsers
    newReadOnlyUsers: $newReadOnlyUsers
    revokeUsers: $revokeUsers
  ) {
    id
    writeAccessLevel
    readAccessLevel
    edit {
      id
      username
    }
    readOnly {
      id
      username
    }
  }
}
    `;

export function useUpdatePermissionsMutation() {
  return Urql.useMutation<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>(UpdatePermissionsDocument);
};
export const PermissionsDocument = gql`
    query Permissions($objectAccessControlId: String!, $worldId: String!) {
  objectAccessControl(id: $objectAccessControlId) {
    id
    writeAccessLevel
    readAccessLevel
    edit {
      id
      username
    }
    readOnly {
      id
      username
    }
    editable
  }
  world(id: $worldId) {
    id
    roles {
      id
      user {
        id
        username
      }
    }
  }
}
    `;

export function usePermissionsQuery(options: Omit<Urql.UseQueryArgs<PermissionsQueryVariables>, 'query'>) {
  return Urql.useQuery<PermissionsQuery>({ query: PermissionsDocument, ...options });
};
export const RootFolderDocument = gql`
    query RootFolder($worldId: String!) {
  world(id: $worldId) {
    id
    rootFolder {
      id
    }
  }
}
    `;

export function useRootFolderQuery(options: Omit<Urql.UseQueryArgs<RootFolderQueryVariables>, 'query'>) {
  return Urql.useQuery<RootFolderQuery>({ query: RootFolderDocument, ...options });
};
export const TextSectionDocument = gql`
    query TextSection($id: String!) {
  textSection(id: $id) {
    id
    content
  }
}
    `;

export function useTextSectionQuery(options: Omit<Urql.UseQueryArgs<TextSectionQueryVariables>, 'query'>) {
  return Urql.useQuery<TextSectionQuery>({ query: TextSectionDocument, ...options });
};
export const UpdateTextSectionDocument = gql`
    mutation UpdateTextSection($id: String!, $content: String) {
  updateTextSection(content: $content, id: $id) {
    id
    content
  }
}
    `;

export function useUpdateTextSectionMutation() {
  return Urql.useMutation<UpdateTextSectionMutation, UpdateTextSectionMutationVariables>(UpdateTextSectionDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    id
    username
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const WorldDocument = gql`
    query World($id: String!) {
  world(id: $id) {
    id
    name
    myRole
    roles {
      id
      user {
        id
        username
      }
      level
    }
    rootFolder {
      id
    }
  }
}
    `;

export function useWorldQuery(options: Omit<Urql.UseQueryArgs<WorldQueryVariables>, 'query'>) {
  return Urql.useQuery<WorldQuery>({ query: WorldDocument, ...options });
};
export const DeleteWorldDocument = gql`
    mutation DeleteWorld($worldId: String!) {
  deleteWorld(id: $worldId) {
    id
  }
}
    `;

export function useDeleteWorldMutation() {
  return Urql.useMutation<DeleteWorldMutation, DeleteWorldMutationVariables>(DeleteWorldDocument);
};
export const MyWorldsDocument = gql`
    query MyWorlds {
  myWorlds {
    id
  }
}
    `;

export function useMyWorldsQuery(options?: Omit<Urql.UseQueryArgs<MyWorldsQueryVariables>, 'query'>) {
  return Urql.useQuery<MyWorldsQuery>({ query: MyWorldsDocument, ...options });
};
export const CreateWorldDocument = gql`
    mutation CreateWorld($name: String!) {
  createWorld(name: $name) {
    data {
      id
      name
    }
    errors
    fieldErrors {
      field
      message
    }
  }
}
    `;

export function useCreateWorldMutation() {
  return Urql.useMutation<CreateWorldMutation, CreateWorldMutationVariables>(CreateWorldDocument);
};
export const FolderAndDocumentSuggestionsDocument = gql`
    query FolderAndDocumentSuggestions($nameFilter: String!, $worldId: String!) {
  folders(worldId: $worldId, nameFilter: $nameFilter) {
    id
    name
  }
  documents(worldId: $worldId, nameFilter: $nameFilter) {
    id
    name
  }
}
    `;

export function useFolderAndDocumentSuggestionsQuery(options: Omit<Urql.UseQueryArgs<FolderAndDocumentSuggestionsQueryVariables>, 'query'>) {
  return Urql.useQuery<FolderAndDocumentSuggestionsQuery>({ query: FolderAndDocumentSuggestionsDocument, ...options });
};