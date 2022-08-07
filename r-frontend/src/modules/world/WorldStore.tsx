import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
  Dispatch,
} from "react";

export interface WorldStateInterface {
  currentWorld?: string;
  persistenceType: "local" | "session";
}

enum EActionType {
  SET_WORLD,
  PURGE,
}

type ActionType = {
  type: EActionType;
  payload?: any;
};

type ContextType = {
  worldState: WorldStateInterface;
  dispatch: Dispatch<ActionType>;
};

const Reducer = (
  state: WorldStateInterface,
  action: ActionType
): WorldStateInterface => {
  switch (action.type) {
    case EActionType.SET_WORLD:
      return {
        ...state,
        currentWorld: action.payload,
      };
    case EActionType.PURGE:
      return initialState;
  }
};

/**
 * React Context-based World Store with a reducer
 * and persistent saves to sessionStorage/localStorage
 **/
export function WorldStore({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [worldState, dispatch] = useReducer(Reducer, initializeState());
  const initialRenderWorldState = useRef(true);
  const initialRenderPersistenceType = useRef(true);

  useEffect(() => {
    /*
     populate either sessionStorage or localStorage
     data from worldState based on persistenceType
    */
    if (initialRenderWorldState.current) {
      initialRenderWorldState.current = false;
      return;
    }
    const getPersistenceType = worldState.persistenceType;
    if (getPersistenceType === "session") {
      sessionStorage.setItem("worldState", JSON.stringify(worldState));
    } else if (getPersistenceType === "local") {
      localStorage.setItem("worldState", JSON.stringify(worldState));
    }
  }, [worldState]);

  useEffect(() => {
    /*
     purge sessionStorage or localStorage when either is selected
    */
    if (initialRenderPersistenceType.current) {
      initialRenderPersistenceType.current = false;
      return;
    }
    const getPersistenceType = worldState.persistenceType;
    if (getPersistenceType === "session") {
      localStorage.removeItem("worldState");
    } else if (getPersistenceType === "local") {
      sessionStorage.removeItem("worldState");
    }
  }, [worldState.persistenceType]);

  return (
    <worldContext.Provider value={{ worldState, dispatch }}>
      {children}
    </worldContext.Provider>
  );
}

const worldContext = createContext({} as ContextType);

export const initialState: WorldStateInterface = {
  currentWorld: undefined,
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
    localStorage.getItem("worldState") as string
  ) as WorldStateInterface;
  const fromSessionStorage = JSON.parse(
    sessionStorage.getItem("worldState") as string
  ) as WorldStateInterface;
  return fromSessionStorage || fromLocalStorage || initialState;
}

export const useWorldState = () => {
  const { worldState, dispatch } = useContext(worldContext);
  return {
    state: worldState,
    updater: {
      setWorld: (worldID: string | undefined) => {
        dispatch({
          type: EActionType.SET_WORLD,
          payload: worldID,
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
