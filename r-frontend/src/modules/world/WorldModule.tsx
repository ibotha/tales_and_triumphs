import { Route, Routes } from "react-router-dom";
import { WorldRoot } from "./WorldRoot";

type Props = {};

export const WorldModule = (_: Props) => {
  return (
    <Routes>
      <Route path="/" element={<WorldRoot />}></Route>
    </Routes>
  );
};
