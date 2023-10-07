// import {Buffer} from "buffer";
import * as ethers from "ethers";
// import { Server } from '@ensdomains/ccip-read-cf-worker';
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json';
import {defaultAbiCoder, hexConcat} from "ethers/lib/utils";
import {Buffer} from "buffer";
import {SigningKey} from "@ethersproject/signing-key";
// import { abi as IResolverService_abi } from '@ensdomains/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/IResolverService.json';
// import {Result} from "@ethersproject/abi";
// import {hexConcat} from "ethers/lib/utils";

// const dataRequest = '0xCBDbC3EC4133f489d63A54E8784b1447FC37DE04/0x9061b92300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000001a07657468726f6d650c6f6666636861696e64656d6f036574680000000000000000000000000000000000000000000000000000000000000000000000000000243b3b57de60345e90e274c6afca1e14cba855c64b4d1803a8bd3743775a865ddddc4bf88800000000000000000000000000000000000000000000000000000000.json';
const dataRequest = '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000110474657374066d65746f6e7903657468000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f1cb7e0668cf610405ae6c9b41c6cf720368dc7b048597250fa2d6ac9d336bd116404641000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000';
const Resolver = new ethers.utils.Interface(Resolver_abi);
const signer = new SigningKey(process.env.PRIVATE_KEY as string);

function decodeDnsName(dnsname: Buffer) {
  const labels = []
  let idx = 0
  while (true) {
    const len = dnsname.readUInt8(idx)
    if (len === 0) break
    labels.push(dnsname.slice(idx + 1, idx + len + 1).toString('utf8'))
    idx += len + 1
  }
  return labels.join('.')
}

const ensValidation = async () => {

  const abiCoder = defaultAbiCoder.decode(["bytes", "bytes"], dataRequest);
  const name = decodeDnsName(Buffer.from(abiCoder[0].slice(2), 'hex'))
  console.log(name);
  const { signature, args } = Resolver.parseTransaction({ data: abiCoder[1] });
  console.log('Signature: ', signature);
  console.log(args);
  const result = { result: ['0x74C19105f358BAb85f8E9FDA9202A1326A714d89'], ttl: 0 };
  console.log('Result: ', result);
  const paddedAddress = ethers.utils.hexZeroPad(result.result[0], 32);
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
      '0xabe739af28742ca9b9aa83e5a01439a66f0361e3',
      finalResult2.validUntil,
      ethers.utils.keccak256(dataRequest || '0x'),
      ethers.utils.keccak256(finalResult2.result),
    ]
  )

  const sig = signer.signDigest(messageHash)
  const sigData = hexConcat([sig.r, sig.s, new Uint8Array([sig.v])]);
  console.log('Sig data: ', sigData);
  /*
  const finalResult = {
    result: Resolver.encodeFunctionResult(signature, [ result ]),
    validUntil: Math.floor(Date.now() / 1000),
  };
  console.log(finalResult);
   */
};

ensValidation().then(() => {});
