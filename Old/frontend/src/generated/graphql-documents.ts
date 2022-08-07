import gql from 'graphql-tag';
export const basicDocument = gql`
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
  deleteDocument(id: $id) {
    id
  }
}
    `;
export const createTextSection = gql`
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
export const deleteDocumentSection = gql`
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
export const updateDocument = gql`
    mutation UpdateDocument($id: String!, $name: String) {
  updateDocument(id: $id, name: $name) {
    id
    name
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
export const documentSection = gql`
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
    mutation UpdateFolder($name: String, $id: String!, $colour: String) {
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
export const updatePermissions = gql`
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
export const permissions = gql`
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
export const textSection = gql`
    query TextSection($id: String!) {
  textSection(id: $id) {
    id
    content
  }
}
    `;
export const updateTextSection = gql`
    mutation UpdateTextSection($id: String!, $content: String) {
  updateTextSection(content: $content, id: $id) {
    id
    content
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
  deleteWorld(id: $worldId) {
    id
  }
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
export const folderAndDocumentSuggestions = gql`
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