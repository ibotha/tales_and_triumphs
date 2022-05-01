import { FunctionComponent, useEffect, useState } from "react";
import {
  RoleLevel,
  usePermissionsQuery,
  useUpdatePermissionsMutation,
} from "../../generated/graphql-components";
import Dropdown from "../form/Dropdown";
import ModalComponent from "../structure/ModalComponent";
import "./noteExplorer.scss";

type Props = {
  objectAccessControlId: string;
  worldId: string;
};

const Permissions: FunctionComponent<Props> = ({
  objectAccessControlId,
  worldId,
}) => {
  const [{ fetching, data, error }] = usePermissionsQuery({
    variables: {
      objectAccessControlId: objectAccessControlId,
      worldId: worldId,
    },
  });
  const [_, updateMutation] = useUpdatePermissionsMutation();

  let [addEditorsModal, setAddEditorsModal] = useState(false);
  let [addReadersModal, setAddReadersModal] = useState(false);

  const [edit, setEdit] = useState<
    {
      id: string;
      username: string;
    }[]
  >([]);
  const [readOnly, setReadOnly] = useState<
    {
      id: string;
      username: string;
    }[]
  >([]);

  const [readAccessLevel, setReadAccessLevel] = useState(RoleLevel.Admin);
  const [writeAccessLevel, setWriteAccessLevel] = useState(RoleLevel.Admin);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setEdit((state) => {
      if (!!data && !!data.objectAccessControl)
        return data.objectAccessControl.edit;
      return state;
    });
  }, [data?.objectAccessControl]);

  useEffect(() => {
    setReadOnly((state) => {
      if (!!data && !!data.objectAccessControl)
        return data.objectAccessControl.readOnly;
      return state;
    });
  }, [data?.objectAccessControl]);

  useEffect(() => {
    setReadAccessLevel((state) => {
      if (!!data && !!data.objectAccessControl)
        return data.objectAccessControl.readAccessLevel;
      return state;
    });
  }, [data?.objectAccessControl?.readAccessLevel]);

  useEffect(() => {
    setWriteAccessLevel((state) => {
      if (!!data && !!data.objectAccessControl)
        return data.objectAccessControl.writeAccessLevel;
      return state;
    });
  }, [data?.objectAccessControl?.writeAccessLevel]);

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.objectAccessControl || !data.world || error)
    return <div>{JSON.stringify(error)}</div>;

  let potentialEditors = data.world.roles
    .map((r) => {
      return r.user;
    })
    .filter((r) => {
      return !edit.find((u) => {
        return u.id === r.id;
      });
    });

  let potentialReaders = data.world.roles
    .map((r) => {
      return r.user;
    })
    .filter((r) => {
      return !readOnly.find((u) => {
        return u.id === r.id;
      });
    });

  const calculateDiff = () => {
    let prevEditIds = data.objectAccessControl!.edit.map((u) => u.id);
    let currentEditIds = edit.map((u) => u.id);
    let newEditors = currentEditIds.filter((a) => !prevEditIds.includes(a));

    let prevReadIds = data.objectAccessControl!.readOnly.map((u) => u.id);
    let currentReadIds = readOnly.map((u) => u.id);
    let newReaders = currentReadIds.filter((a) => !prevReadIds.includes(a));

    let allOld = [] as string[];
    new Set([...prevEditIds, ...prevReadIds]).forEach((e) => allOld.push(e));
    let allNew = [] as string[];
    new Set([...currentEditIds, ...currentReadIds]).forEach((e) =>
      allNew.push(e)
    );
    let revokes = allOld.filter((x) => !allNew.includes(x));

    return {
      revokeUsers: revokes.length !== 0 ? revokes : undefined,
      newReadOnlyUsers: newReaders.length !== 0 ? newReaders : undefined,
      newEditorUsers: newEditors.length !== 0 ? newEditors : undefined,
      writeAccessLevel:
        writeAccessLevel != data.objectAccessControl!.writeAccessLevel
          ? writeAccessLevel
          : undefined,
      readAccessLevel:
        readAccessLevel != data.objectAccessControl!.readAccessLevel
          ? readAccessLevel
          : undefined,
    };
  };

  const isDifferent = (() => {
    let diff = calculateDiff();
    return !!(
      diff.newEditorUsers ||
      diff.newReadOnlyUsers ||
      diff.readAccessLevel ||
      diff.revokeUsers ||
      diff.writeAccessLevel
    );
  })();

  const save = async () => {
    await updateMutation({
      objectAccessControlId: objectAccessControlId,
      ...calculateDiff(),
    });
  };

  interface permUser {
    id: string;
    username: string;
  }
  const addEditor = (u: permUser) => {
    setEdit(edit.concat([u]));
    removeReader(u);
  };

  const removeEditor = (u: permUser) => {
    setEdit(edit.filter((e) => u.id != e.id));
  };

  const addReader = (u: permUser) => {
    setReadOnly(readOnly.concat([u]));
    removeEditor(u);
  };

  const removeReader = (u: permUser) => {
    setReadOnly(readOnly.filter((e) => u.id != e.id));
  };
  return (
    <div>
      <div
        style={{ backgroundColor: "var(--color-background-soft)" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        Permissions
      </div>
      {!collapsed ? (
        <div className="permissions-container">
          <div style={{ display: "flex" }}>
            <div>Editors:</div>
            <div className="username-badge-list">
              {edit.map((u) => {
                return (
                  <div
                    className="username-badge"
                    key={u.id}
                    onClick={() => removeEditor(u)}
                  >
                    {u.username}
                  </div>
                );
              })}
            </div>
            {data.objectAccessControl.editable ? (
              <div
                className="btn"
                style={{ marginLeft: "auto", padding: "0 0.5em" }}
                onClick={() => setAddEditorsModal(true)}
              >
                +
              </div>
            ) : null}
            {addEditorsModal ? (
              <ModalComponent close={() => setAddEditorsModal(false)}>
                {potentialEditors.map((u) => (
                  <div key={u.id} onClick={() => addEditor(u)}>
                    {u.username}
                  </div>
                ))}
              </ModalComponent>
            ) : null}
          </div>
          <div style={{ display: "flex" }}>
            <div>Readers:</div>
            <div className="username-badge-list">
              {readOnly.map((u) => (
                <div
                  className="username-badge"
                  key={u.id}
                  onClick={() => removeReader(u)}
                >
                  {u.username}
                </div>
              ))}
            </div>
            <div
              v-if="data.objectAccessControl.editable"
              className="btn"
              style={{ marginLeft: "auto", padding: "0 0.5em" }}
              onClick={() => setAddReadersModal(true)}
            >
              +
            </div>
            {addReadersModal ? (
              <ModalComponent close={() => setAddReadersModal(false)}>
                {potentialReaders.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      addReader(u);
                    }}
                  >
                    {u.username}
                  </div>
                ))}
              </ModalComponent>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: "0.5em" }}>
            Read:
            <Dropdown
              options={["ADMIN", "TRUSTED", "USER", "PUBLIC"]}
              value={readAccessLevel}
              onChange={(v) => setReadAccessLevel(v as RoleLevel)}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5em" }}>
            Write:
            <Dropdown
              options={["ADMIN", "TRUSTED", "USER", "PUBLIC"]}
              value={writeAccessLevel}
              onChange={(v) => setWriteAccessLevel(v as RoleLevel)}
            ></Dropdown>
          </div>
          {isDifferent ? (
            <div className="btn" onClick={save}>
              Save
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Permissions;
