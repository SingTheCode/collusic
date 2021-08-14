import { atom } from "recoil";

const projectState = atom({
  key: "projectState",
  default: null,
});

export { projectState };
