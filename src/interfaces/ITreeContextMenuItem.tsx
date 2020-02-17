import ITreeNode from "./ITreeNode";

export default interface ITreeContextMenuItem {
  label: string;
  callback: (node: ITreeNode) => void;
}
