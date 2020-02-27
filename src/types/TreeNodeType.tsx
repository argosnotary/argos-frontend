export enum TreeNodeTypes {
  UNSPECIFIED = "",
  LABEL = "LABEL",
  SUPPLY_CHAIN = "SUPPLY_CHAIN",
  NON_PERSONAL_ACCOUNT = "NON_PERSONAL_ACCOUNT"
}

export type TreeNodeType = TreeNodeTypes.UNSPECIFIED | TreeNodeTypes.LABEL | TreeNodeTypes.SUPPLY_CHAIN | TreeNodeTypes.NON_PERSONAL_ACCOUNT
