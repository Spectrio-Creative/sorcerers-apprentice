import { Status } from "../../classes/Status";
import { status as projectStatus } from "./menu";

export const status = new Status();

export let clearListener: () => void;

export const initializeStatus = () => {
  clearListener = status.addListener((text) => {
    projectStatus.text = text;
  });
};

export const terminateStatus = () => {
  clearListener();
};