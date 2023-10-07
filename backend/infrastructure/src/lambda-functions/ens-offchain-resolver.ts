import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
// import {SigningKey} from "@ethersproject/signing-key";
// import {Buffer} from "buffer";
// import * as ethers from "ethers";
// import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json'
// import { abi as IResolverService_abi } from '@ensdomains/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/IResolverService.json'

// const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
// const signer = new SigningKey(PRIVATE_KEY);
// const resolver = new ethers.utils.Interface(Resolver_abi);

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
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}
