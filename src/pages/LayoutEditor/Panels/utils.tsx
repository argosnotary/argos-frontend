import DataRequest from "../../../types/DataRequest";
import ITreeNode from "../../../interfaces/ITreeNode";
import useToken from "../../../hooks/useToken";


export const updateNewTreeNode = (labelId: string, onSuccess: (node: ITreeNode) => void) => {

    const [localStorageToken] = useToken();

    const hierarchyDataRequest: DataRequest = {
        params: {
            HierarchyMode: "NONE"
        },
        method: "get",
        token: localStorageToken,
        url: `/api/hierarchy/${labelId}`,
        cbSuccess: (node: ITreeNode) => {
            onSuccess(node);
        }
    };
    return hierarchyDataRequest;
};