import API from "data/http/axios/api";
import { atom, selector } from "recoil";

const projectState = atom({
  key: "projectState",
  default: null,
});

const getProjectSeletor = selector({
  key: "project/get",
  get: async ({ get }) => {
    try {
      const { data } = await API.get("/projects");
      return data.data;
    } catch (err) {
      throw err;
    }
  },
  set: ({ set }, newValue) => {
    set(projectState, newValue);
  },
});

export { getProjectSeletor };
