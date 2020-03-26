import DataRequest from "../../../types/DataRequest";
import ITreeNode from "../../../interfaces/ITreeNode";
import useToken from "../../../hooks/useToken";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import {useContext} from "react";
import {LayoutEditorDataActionTypes, StateContext} from "../../../stores/layoutEditorStore";

function updateNewTreeNode(): [(labelId: string, parentLabelId?: string) => void, any] {
    const [treeChildrenApiResponse, setTreeChildrenApiRequest] = useDataApi(
        genericDataFetchReducer
    );
    const [localStorageToken] = useToken();

    const [_state, dispatch] = useContext(StateContext);

    const doCall = (labelId: string, parentLabelId?: string) => {
        const hierarchyDataRequest: DataRequest = {
            params: {
                HierarchyMode: "NONE"
            },
            method: "get",
            token: localStorageToken,
            url: `/api/hierarchy/${labelId}`,
            cbSuccess: (node: ITreeNode) => {
                dispatch({
                    type: LayoutEditorDataActionTypes.ADD_NODE,
                    node: {...node, parentLabelId: parentLabelId}
                });
            }
        };
        setTreeChildrenApiRequest(hierarchyDataRequest);
    };
    return [(labelId: string, parentLabelId?: string) => {
        doCall(labelId, parentLabelId);
    }, treeChildrenApiResponse]
}

export default updateNewTreeNode;