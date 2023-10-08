import {AddressManager} from "../utils/address-manager";
import {UserStealthAddressManager} from "../utils/user-stealth-address-manager";
import {createDdbDocClient} from "../utils/dynamodb-manager";
import {DYNAMODB_TABLE} from "../utils/dynamodb-table";

const ddbDocClient = createDdbDocClient();
const resetUser = async (address: string): Promise<void> => {
  const addressLowercased = AddressManager.toLowerCase(address);
  const userStealthAddressManager = new UserStealthAddressManager(
    ddbDocClient, DYNAMODB_TABLE.USER_STEALTH_ADDRESS
  );
  const userStealthAddressItems = await userStealthAddressManager
    .getUserStealthAddresses(addressLowercased);
  for ( const userStealthAddressItem of userStealthAddressItems ) {
    await ddbDocClient.delete({
      TableName: DYNAMODB_TABLE.USER_STEALTH_ADDRESS,
      Key: { address: addressLowercased, stealthAddress: userStealthAddressItem.stealthAddress },
    });
  }
  await ddbDocClient.delete({
    TableName: DYNAMODB_TABLE.USER,
    Key: { address: addressLowercased },
  });
}

resetUser('0xD2661728b35916D0A15834c558D4e6E3b7567f76').then(() => {});
