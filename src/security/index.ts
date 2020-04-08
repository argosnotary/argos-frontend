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
import {decode, encode} from "base64-arraybuffer";

const arrayBufferToHex = (buffer: ArrayBuffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
};

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
  return await crypto.subtle.generateKey(
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

  return pkcs8.toSchema().toBER(false);
};

const decryptPrivateKey = async (
    password: string,
    encryptedPrivateKey: string
) => {
    const asn1 = asn1js.fromBER(decode(encryptedPrivateKey));
    const keyBag = new PKCS8ShroudedKeyBag({ schema: asn1.result });
    await keyBag.parseInternalValues({password: stringToArrayBuffer(password)});

    const json = keyBag.parsedValue.parsedKey.toJSON();
    const keyData: JsonWebKey = {...json,
      alg: "RS256",
      kty: "RSA"
    };
  return await crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: "RSASSA-PKCS1-v1_5", hash:{name:"SHA-256"}},
      false,
      ["sign"]);
};

const signString = async (
    password: string,
    encryptedPrivateKey: string,
    data: string
) => {
   const privateKey = await decryptPrivateKey(password, encryptedPrivateKey);
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey,stringToArrayBuffer(data));
    return arrayBufferToHex(signature);
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

export { generateEncryptePrivateKey, generateKeyPair, generateKey, signString};
