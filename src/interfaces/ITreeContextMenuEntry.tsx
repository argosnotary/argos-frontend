import ITreeContextMenuItem from "./ITreeContextMenuItem";

export default interface ITreeContextMenuEntry {
  type: string;
  menuitems: Array<ITreeContextMenuItem>;
}
