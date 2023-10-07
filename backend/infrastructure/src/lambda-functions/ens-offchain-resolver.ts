import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {SigningKey} from "@ethersproject/signing-key";
// import { keccak256 } from 'viem';
// import { toHex } from 'viem/utils';
// import {Buffer} from "buffer";
import * as ethers from "ethers";
import {hexConcat} from "ethers/lib/utils";
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json'
// import { abi as IResolverService_abi } from '@ensdomains/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/IResolverService.json'

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const signer = new SigningKey(PRIVATE_KEY);
const resolver = new ethers.utils.Interface(Resolver_abi);

/*
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
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  /*
    const name = decodeDnsName(Buffer.from(encodedName.slice(2), 'hex'))

    // Query the database
    const { result, validUntil } = await query(await db, name, data, env)

    // Hash and sign the response
    let messageHash = ethers.utils.solidityKeccak256(
      ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
      [
        '0x1900',
        request?.to,
        validUntil,
        ethers.utils.keccak256(request?.data || '0x'),
        ethers.utils.keccak256(result),
      ]
    )

    const sig = signer.signDigest(messageHash)
    const sigData = hexConcat([sig.r, sig.s, new Uint8Array([sig.v])])
    return [result, validUntil, sigData]
  },
  */

  const result = {addr: ['0x74C19105f358BAb85f8E9FDA9202A1326A714d89'], ttl: 1000};
  // const result = JSON.stringify({});
  const resultEnccoded = resolver.encodeFunctionResult('addr(bytes32,uint256)', [ result ]);
  let messageHash = ethers.utils.solidityKeccak256(
    ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
    [
      '0x1900',
      '0xCBDbC3EC4133f489d63A54E8784b1447FC37DE04',
      0,
      ethers.utils.keccak256('0x'),
      ethers.utils.keccak256(resultEnccoded),
    ]
  )

  const sig = signer.signDigest(messageHash)
  const sigData = hexConcat([sig.r, sig.s, new Uint8Array([sig.v])])

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: result,
      sigData: sigData,
      validUntil: 0
    }),
  };
}

// @ts-ignore
lambdaHandler({}).then(() => {});
