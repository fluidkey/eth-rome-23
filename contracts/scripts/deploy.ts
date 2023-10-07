import { ethers } from 'hardhat';
import { OffchainResolver } from '../typechain-types';


void (async () => {

  // We get the contract to deploy
  const [owner] = await ethers.getSigners();

  // get the next nouce
  let next_nonce = await owner.getNonce();

  // @ts-ignore
  const contractFactory = await ethers.getContractFactory("OffchainResolver", owner);
  const offchainResovler = await contractFactory.deploy(
    'https://ch3wvzzixa356guzaq6mos27aa0cwwde.lambda-url.eu-west-1.on.aws/{sender}/{data}.json',
    ['0x31786B93d8165384aB95d1ad6e68E7fB4C38662c'],
    { nonce: next_nonce }
  );

  console.log(`offchainResolver deployed at ${await offchainResovler.getAddress()}`);

})();
