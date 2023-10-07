import { getAddress, isAddress } from 'viem';
export class AddressManager {
  public static toChecksum = (address: string): string => {
    if ( !AddressManager.isValidAddress(address) ) throw new Error('Invalid address parameter');
    return getAddress(address);
  };
  public static toLowerCase = (address: string): string => {
    if ( !AddressManager.isValidAddress(address) ) throw new Error('Invalid address parameter');
    return address.toLowerCase().trim();
  };
  public static isValidAddress = (address: string): boolean => {
    return isAddress(address);
  };
}
