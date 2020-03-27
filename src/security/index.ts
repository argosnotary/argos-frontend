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
import * as asn1js from "asn1js";
import generatePassword from "password-generator";
import { PKCS8ShroudedKeyBag, PrivateKeyInfo } from "pkijs";

const arrayBufferToHex = (buffer: ArrayBuffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
};

const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) =>
  btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

function stringToArrayBuffer(input: string) {
  const { length } = input;
  const buffer = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    buffer[i] = input.charCodeAt(i);
  }

  return buffer;
}

const concatArrayBuffers = (buffer1: ArrayBuffer, buffer2: ArrayBuffer) => {
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

const generateKeyPair = async () => {
  const keyPair = await crypto.subtle.generateKey(
    {
      hash: {
        name: "SHA-256"
      },
      modulusLength: 2048,
      name: "RSASSA-PKCS1-v1_5",
      publicExponent: new Uint8Array([1, 0, 1])
    },
    true,
    ["sign"]
  );

  return keyPair;
};

const generateEncryptePrivateKey = async (
  password: string,
  privateKey: CryptoKey
) => {
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
  const encKeyBinary = pkcs8.toSchema().toBER(false);

  return encKeyBinary;
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

const generateKey = async (hashKeyPassphrase = false) => {
  const keyPair = await generateKeyPair();
  const exportedPublicKey = await crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );

  const password = generatePassword(14, false);
  const encryptedPrivateKey = await generateEncryptePrivateKey(
    password,
    keyPair.privateKey
  );
  const digestedPublicKey = await crypto.subtle.digest(
    "SHA-256",
    exportedPublicKey
  );

  const keyObj: IKey = {
    keys: {
      encryptedPrivateKey: arrayBufferToBase64(encryptedPrivateKey),
      keyId: arrayBufferToHex(digestedPublicKey),
      publicKey: arrayBufferToBase64(exportedPublicKey)
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

export { generateEncryptePrivateKey, generateKeyPair, generateKey };
