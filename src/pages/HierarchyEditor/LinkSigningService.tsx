/*
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { signString } from "../../security";
import { IArtifact, ILink, ILinkMetaBlock } from "../../interfaces/ILink";
import stringify from "json-stable-stringify";

const signLink = async (
  password: string,
  keyId: string,
  encryptedPrivateKey: string,
  link: ILink
): Promise<ILinkMetaBlock> => {
  const signature = await signString(
    password,
    encryptedPrivateKey,
    serialize(link)
  );
  return {
    signature: {
      signature: signature,
      keyId: keyId,
      keyAlgorithm: "EC",
      hashAlgorithm: "SHA384"
    },
    link: link
  };
};

const serialize = (link: ILink): string => {
  const cloneLink: ILink = {
    ...link,
    materials: sort(link.materials),
    products: sort(link.products)
  };
  return stringify(cloneLink);
};

const sort = (artifacts: Array<IArtifact>) => {
  return artifacts.sort((n1, n2) => {
    if (n1.uri > n2.uri) {
      return 1;
    }

    if (n1.uri < n2.uri) {
      return -1;
    }

    return 0;
  });
};

export { serialize, signLink };
