export default interface ITreeNode {
  hasChildren: boolean;
  name: string;
  type: string;
  referenceId: string;
  children?: Array<ITreeNode>;
}
