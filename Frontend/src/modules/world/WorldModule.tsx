import { useGlobalState } from "../../stores/GlobalStore";

type Props = {};

export const WorldModule = (_: Props) => {
  const { state, updater } = useGlobalState();
  return (
    <div>
      <button onClick={() => updater.purge()}>Purge Session</button>
      Welcome {state.user?.username}
    </div>
  );
};
