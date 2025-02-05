import Board from "../Board";
import { ModelsWorkingCommands, IActionConfig } from "../../utils/constants";

export type TServicedBoard = Board;
export type TActionsConfigsList = Record<ModelsWorkingCommands, IActionConfig>;