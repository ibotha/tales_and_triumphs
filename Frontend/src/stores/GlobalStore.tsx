import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { Dispatch } from "react";
import { IUser } from "../types";

export interface GlobalStateInterface {
  user?: IUser;
  persistenceType: "local" | "session";
}

enum EActionType {
  SET_USER,
  PURGE,
}

type ActionType = {
  type: EActionType;
  payload?: any;
};

type ContextType = {
  globalState: GlobalStateInterface;
  dispatch: Dispatch<ActionType>;
};

const Reducer = (
  state: GlobalStateInterface,
  action: ActionType
): GlobalStateInterface => {
  switch (action.type) {
    case EActionType.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case EActionType.PURGE:
      return initialState;
  }
};

/**
 * React Context-based Global Store with a reducer
 * and persistent saves to sessionStorage/localStorage
 **/
export function GlobalStore({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [globalState, dispatch] = useReducer(Reducer, initializeState());
  const initialRenderGlobalState = useRef(true);
  const initialRenderPersistenceType = useRef(true);

  useEffect(() => {
    /*
     populate either sessionStorage or localStorage
     data from globalState based on persistenceType
    */
    if (initialRenderGlobalState.current) {
      initialRenderGlobalState.current = false;
      return;
    }
    const getPersistenceType = globalState.persistenceType;
    if (getPersistenceType === "session") {
      sessionStorage.setItem("globalState", JSON.stringify(globalState));
    } else if (getPersistenceType === "local") {
      localStorage.setItem("globalState", JSON.stringify(globalState));
    }
  }, [globalState]);

  useEffect(() => {
    /*
     purge sessionStorage or localStorage when either is selected
    */
    if (initialRenderPersistenceType.current) {
      initialRenderPersistenceType.current = false;
      return;
    }
    const getPersistenceType = globalState.persistenceType;
    if (getPersistenceType === "session") {
      localStorage.removeItem("globalState");
    } else if (getPersistenceType === "local") {
      sessionStorage.removeItem("globalState");
    }
  }, [globalState.persistenceType]);

  return (
    <globalContext.Provider value={{ globalState, dispatch }}>
      {children}
    </globalContext.Provider>
  );
}

const globalContext = createContext({} as ContextType);

export const initialState: GlobalStateInterface = {
  user: undefined,
  persistenceType: "local",
};

function initializeState() {
  /*
   the order in which the data is compared is very important;
   first try to populate the state from Storage if not return initialState
  */

  if (typeof Storage !== "undefined") {
  } else {
    throw new Error("You need to enable Storage to run this app.");
  }

  const fromLocalStorage = JSON.parse(
    localStorage.getItem("globalState") as string
  );
  const fromSessionStorage = JSON.parse(
    sessionStorage.getItem("globalState") as string
  );
  return fromSessionStorage || fromLocalStorage || initialState;
}

export const useGlobalState = () => {
  const { globalState, dispatch } = useContext(globalContext);
  return {
    state: globalState,
    updater: {
      setUser: (user: IUser) => {
        dispatch({
          type: EActionType.SET_USER,
          payload: user,
        });
      },
      purge: () => {
        dispatch({
          type: EActionType.PURGE,
        });
      },
    },
  };
};
