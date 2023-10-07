import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {SigningKey} from "@ethersproject/signing-key";
// import { keccak256 } from 'viem';
// import { toHex } from 'viem/utils';
// import {Buffer} from "buffer";
import * as ethers from "ethers";
import {defaultAbiCoder, hexConcat} from "ethers/lib/utils";
import { hexlify } from '@ethersproject/bytes';
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json'
import {Buffer} from "buffer";
import {generatePrivateKey, privateKeyToAccount} from "viem/accounts";
// import { abi as IResolverService_abi } from '@ensdomains/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/IResolverService.json'

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const signer = new SigningKey(PRIVATE_KEY);
const Resolver = new ethers.utils.Interface(Resolver_abi);

function decodeDnsName(dnsname: Buffer) {
  const labels = [];
  let idx = 0;
  while (true) {
    const len = dnsname.readUInt8(idx);
    if (len === 0) break;
    labels.push(dnsname.slice(idx + 1, idx + len + 1).toString('utf8'));
    idx += len + 1;
  }
  return labels.join('.');
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  // @ts-ignore
  console.log(event.rawPath);
  //   console.log(event.requestContext.path);
  // @ts-ignore
  const rawPath = event.rawPath;
  const rawPathSplit = rawPath.split('/');
  const requestTo = rawPathSplit[1];

  const dataWithoutJson = rawPathSplit[2].replace('.json', '');
  console.log('Data without json: ', dataWithoutJson);
  const data = `0x${dataWithoutJson.slice(10)}`;
  console.log('Data: ', data);

  const abiCoder = defaultAbiCoder.decode(["bytes", "bytes"], data);
  const name = decodeDnsName(Buffer.from(abiCoder[0].slice(2), 'hex'));
  console.log('Username: ', name);

  const { signature, args } = Resolver.parseTransaction({ data: abiCoder[1] });
  console.log('Signature: ', signature);
  console.log(args);
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const result = { result: [account.address], ttl: 0 };
  console.log('Result: ', result);
  let paddedAddress;
  if ( signature === 'addr(bytes32)') {
    paddedAddress = result.result[0];
  } else {
    paddedAddress = ethers.utils.hexZeroPad(result.result[0], 32);
  }
  console.log('Padded address: ', paddedAddress);
  // const resultTuple = [ethers.utils.formatBytes32String(paddedAddress), result.ttl];
  const resultTuple = [paddedAddress, result.ttl];
  console.log('Result tuple: ', resultTuple);
  const finalResult2 = {
    result: Resolver.encodeFunctionResult(signature, [paddedAddress]),
    validUntil: Math.floor(Date.now() / 1000) + 100,
  };
  console.log('Final result 2: ', finalResult2);

  // Hash and sign the response
  let messageHash = ethers.utils.solidityKeccak256(
    ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
    [
      '0x1900',
      requestTo,
      finalResult2.validUntil,
      ethers.utils.keccak256(dataWithoutJson || '0x'),
      ethers.utils.keccak256(finalResult2.result),
    ]
  )

  const sig = signer.signDigest(messageHash)
  const sigData = hexConcat([sig.r, sig.s, new Uint8Array([sig.v])]);
  console.log('Sig data: ', sigData);
  const dataResult = hexlify(ethers.utils.defaultAbiCoder.encode(
    ['bytes', 'uint64', 'bytes'], [finalResult2.result, finalResult2.validUntil, sigData]));
  return {
    statusCode: 200,
    body: JSON.stringify({data: dataResult}),
  };
}

// @ts-ignore
/*
lambdaHandler({rawPath: '/0xabe739af28742ca9b9aa83e5a01439a66f0361e3/0x9061b92300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000001005706970706f04666b657903657468000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243b3b57de1ab3fdefac178c84411b515152fcb97efcfa096b53c61ab67d62d86f12545c2900000000000000000000000000000000000000000000000000000000.json'}).then((response) => {
  console.log(response);
});
*/
