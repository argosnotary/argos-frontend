/*
 * Copyright (C) 2020 Argos Notary Coöperatie UA
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
import * as asn1js from "asn1js";
import { PKCS8ShroudedKeyBag, PrivateKeyInfo, createCMSECDSASignature } from "pkijs";
import {decode, encode} from "base64-arraybuffer";

const arrayBufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
};

function stringToArrayBuffer(input: string): Uint8Array {
  const { length } = input;
  const buffer = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    buffer[i] = input.charCodeAt(i);
  }

  return buffer;
}

const concatArrayBuffers = (buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer => {
  if (!buffer1) {
    return buffer2;
  } else if (!buffer2) {
    return buffer1;
  }

  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

const generateKeyPair = async (): Promise<CryptoKeyPair> => {
  return await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-384"
    },
    true,
    ["sign"]
  );
};

const generateEncryptedPrivateKey = async (
  password: string,
  privateKey: CryptoKey
): Promise<ArrayBuffer> => {
  const privateKeyBinary = await crypto.subtle.exportKey("pkcs8", privateKey);
  const pkcs8Simpl = new PrivateKeyInfo({
    schema: asn1js.fromBER(privateKeyBinary).result
  });
  const pkcs8 = new PKCS8ShroudedKeyBag({ parsedValue: pkcs8Simpl });
  await pkcs8.makeInternalValues({
    contentEncryptionAlgorithm: {
      length: 256,
      name: "AES-CBC"
    },
    hmacHashAlgorithm: "SHA-256",
    iterationCount: 100000,
    password: stringToArrayBuffer(password)
  });

  return pkcs8.toSchema().toBER(false);
};

export const WRONG_PASSWORD = "wrong password";

const decryptPrivateKey = async (
    password: string,
    encryptedPrivateKey: string
): Promise<CryptoKey> => {
    const asn1 = asn1js.fromBER(decode(encryptedPrivateKey));
    const keyBag = new PKCS8ShroudedKeyBag({ schema: asn1.result });
    try {
      await keyBag.parseInternalValues({password: stringToArrayBuffer(password)});
    } catch (e) {
      return Promise.reject(WRONG_PASSWORD);
    }

    const json = keyBag.parsedValue.parsedKey.toJSON();
    const keyData: JsonWebKey = {...json,
      crv: "P-384",
      kty: "EC"
    };
  return await crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: "ECDSA", namedCurve: "P-384"},
      false,
      ["sign"]);
};

const signString = async (
    password: string,
    encryptedPrivateKey: string,
    data: string
): Promise<string> => {
    const privateKey = await decryptPrivateKey(password, encryptedPrivateKey);
    const signature = await crypto.subtle.sign({name: "ECDSA", hash: "SHA-384"}, privateKey, stringToArrayBuffer(data));
    return arrayBufferToHex(createCMSECDSASignature(signature));
};

interface IKey {
  keys: {
    encryptedPrivateKey: string;
    keyId: string;
    publicKey: string;
    hashedKeyPassphrase?: string;
  };
  password: string;
}

const generatePassword = () => {
  return encode(crypto.getRandomValues(new Uint8Array(30)))
}

const generateKey = async (hashKeyPassphrase = false): Promise<IKey> => {
  const keyPair = await generateKeyPair();
  const exportedPublicKey = await crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );

  const password = generatePassword();
  const encryptedPrivateKey = await generateEncryptedPrivateKey(
    password,
    keyPair.privateKey
  );
  const digestedPublicKey = await crypto.subtle.digest(
    "SHA-256",
    exportedPublicKey
  );

  const keyObj: IKey = {
    keys: {
      encryptedPrivateKey: encode(encryptedPrivateKey),
      keyId: arrayBufferToHex(digestedPublicKey),
      publicKey: encode(exportedPublicKey)
    },
    password
  };

  if (hashKeyPassphrase) {
    const hashedPassphrase = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(password)
    );

    const encodedKeyId = new TextEncoder().encode(keyObj.keys.keyId);
    const hashedCombination = await crypto.subtle.digest(
      "SHA-512",
      concatArrayBuffers(encodedKeyId, hashedPassphrase)
    );

    const hashArray = Array.from(new Uint8Array(hashedCombination));

    keyObj["keys"]["hashedKeyPassphrase"] = hashArray
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  return keyObj;
};

const cryptoAvailable = (): boolean => {
  return typeof crypto != "undefined" && typeof crypto.subtle != "undefined";
}

export {cryptoAvailable,generateKey, signString};
