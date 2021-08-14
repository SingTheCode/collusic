import { atom } from "recoil";

const projectState = atom({
  key: "projectState",
  default: null,
});

const loadingState = atom({
  key: "loadingState",
  default: false,
});

const errorState = atom({
  key: "errorState",
  default: null,
});

export { projectState, loadingState, errorState };
