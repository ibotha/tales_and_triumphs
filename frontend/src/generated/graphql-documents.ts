import gql from 'graphql-tag';
export const basicDocument = gql`
    fragment BasicDocument on Document {
  id
  name
  parentFolder {
    id
  }
  editable
  content
  world {
    id
  }
}
    `;
export const login = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    fieldErrors {
      field
      message
    }
  }
}
    `;
export const register = gql`
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
export const logout = gql`
    mutation Logout {
  logout
}
    `;
export const moveDocument = gql`
    mutation moveDocument($documentId: String!, $parentFolderId: String!) {
  updateDocument(id: $documentId, parentFolderId: $parentFolderId) {
    id
    parentFolder {
      id
    }
  }
}
    `;
export const createDocument = gql`
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
export const deleteDocument = gql`
    mutation DeleteDocument($id: String!) {
  deleteDocument(id: $id)
}
    `;
export const updateDocument = gql`
    mutation UpdateDocument($id: String!, $content: String) {
  updateDocument(id: $id, content: $content) {
    id
    content
  }
}
    `;
export const updateDocumentPermissions = gql`
    mutation UpdateDocumentPermissions($id: String!, $writeAccessLevel: RoleLevel, $readAccessLevel: RoleLevel, $newEditorUsers: [String!], $newReadOnlyUsers: [String!], $revokeUsers: [String!]) {
  updateDocument(
    id: $id
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
export const document = gql`
    query Document($id: String!) {
  document(id: $id) {
    ...BasicDocument
  }
}
    ${basicDocument}`;
export const documentPermissions = gql`
    query DocumentPermissions($id: String!, $worldId: String!) {
  document(id: $id) {
    id
    editable
    edit {
      id
      username
    }
    readOnly {
      id
      username
    }
    readAccessLevel
    writeAccessLevel
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
export const moveFolder = gql`
    mutation moveFolder($folderId: String!, $parentFolderId: String!) {
  updateFolder(id: $folderId, parentFolderId: $parentFolderId) {
    id
    parentFolder {
      id
    }
  }
}
    `;
export const deleteFolder = gql`
    mutation DeleteFolder($id: String!) {
  deleteFolder(id: $id) {
    id
    parentFolder {
      id
    }
  }
}
    `;
export const updateFolderPermissions = gql`
    mutation UpdateFolderPermissions($id: String!, $writeAccessLevel: RoleLevel, $readAccessLevel: RoleLevel, $newEditorUsers: [String!], $newReadOnlyUsers: [String!], $revokeUsers: [String!]) {
  updateFolder(
    id: $id
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
export const createFolder = gql`
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
export const updateFolder = gql`
    mutation UpdateFolder($name: String!, $id: String!, $colour: String!) {
  updateFolder(name: $name, id: $id, colour: $colour) {
    id
    name
    colour
  }
}
    `;
export const folderContents = gql`
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
export const folder = gql`
    query Folder($id: String!) {
  folder(id: $id) {
    id
    name
    colour
    edit {
      id
    }
    readOnly {
      id
    }
    readAccessLevel
    writeAccessLevel
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
    editable
  }
}
    `;
export const folderPermissions = gql`
    query FolderPermissions($id: String!, $worldId: String!) {
  folder(id: $id) {
    id
    editable
    edit {
      id
      username
    }
    readOnly {
      id
      username
    }
    readAccessLevel
    writeAccessLevel
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
export const assignUserRole = gql`
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
export const rootFolder = gql`
    query RootFolder($worldId: String!) {
  world(id: $worldId) {
    id
    rootFolder {
      id
    }
  }
}
    `;
export const me = gql`
    query Me {
  me {
    id
    username
  }
}
    `;
export const world = gql`
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
export const deleteWorld = gql`
    mutation DeleteWorld($worldId: String!) {
  deleteWorld(id: $worldId)
}
    `;
export const myWorlds = gql`
    query MyWorlds {
  myWorlds {
    id
  }
}
    `;
export const createWorld = gql`
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