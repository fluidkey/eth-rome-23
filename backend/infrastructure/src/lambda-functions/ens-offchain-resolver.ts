import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {SigningKey} from "@ethersproject/signing-key";
import * as ethers from "ethers";
import {defaultAbiCoder, hexConcat} from "ethers/lib/utils";
import {hexlify} from '@ethersproject/bytes';
import {abi as Resolver_abi} from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json'
import {Buffer} from "buffer";
import {createDdbDocClient} from "./utils/dynamodb-manager";
import {UserManager} from "./utils/user-manager";
import {DYNAMODB_TABLE} from "./utils/dynamodb-table";
import {UserStealthAddressManager} from "./utils/user-stealth-address-manager";

const ddbDocClient = createDdbDocClient();
const userManager = new UserManager(ddbDocClient, DYNAMODB_TABLE.USER);
const userStealthAddressManager = new UserStealthAddressManager(
  ddbDocClient, DYNAMODB_TABLE.USER_STEALTH_ADDRESS);
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const signer = new SigningKey(PRIVATE_KEY);
const Resolver = new ethers.utils.Interface(Resolver_abi);

const decodeDnsName = (dnsname: Buffer): string => {
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
  const username = decodeDnsName(Buffer.from(abiCoder[0].slice(2), 'hex'));
  console.log('Username: ', username);
  // check if the username exists
  const userItem = await userManager.getUserByUsername(username);
  const { signature, args } = Resolver.parseTransaction({ data: abiCoder[1] });
  console.log('Signature: ', signature);
  console.log(args);
  let paddedAddress;
  if ( signature === 'addr(bytes32)' || signature === 'addr(bytes32,uint256)') {
    let startingAddres;
    if ( userItem !== undefined ) {
      const userStealthAddress = await UserStealthAddressManager.generateStealthAddress({
        userSpendingPubKey: userItem.spendingPubKey,
        userViewingPubKey: userItem.viewingPubKey,
      });
      await userStealthAddressManager.createUserStealthAddress({
        address: userItem.address,
        ephemeralPubKey: userStealthAddress.ephemeralPubKey,
        stealthAddress: userStealthAddress.stealthAddress,
        hashedSharedSecret: userStealthAddress.hashedSharedSecret,
      });
      startingAddres = userStealthAddress.stealthAddress;
    } else startingAddres = '0x';
    paddedAddress = signature === 'addr(bytes32)' ? startingAddres : ethers.utils.hexZeroPad('0x0', 32);
  } else if ( signature === 'text(bytes32,string)' ) paddedAddress = '';
  else paddedAddress = '0x';
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
