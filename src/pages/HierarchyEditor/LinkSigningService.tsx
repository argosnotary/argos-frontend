import {signString} from "../../security";
import {ILink, ILinkMetaBlock} from "../../interfaces/ILink";
import stringify from "json-stable-stringify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signLink = async (
    password: string,
    keyId: string,
    encryptedPrivateKey: string,
    link: ILink,
    supplyChainId: string
): Promise<ILinkMetaBlock> => {
    const signature = await signString(
        password,
        encryptedPrivateKey,
        serialize(link)
    );
    return {
        supplyChainId: supplyChainId,
        signature: { signature: signature, keyId: keyId },
        link: link
    };
};

const serialize = (link: ILink): string => {
    return stringify(link);
};

export { serialize,  signLink};