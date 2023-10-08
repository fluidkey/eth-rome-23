# Fluidkey ENS

This is our submission for the ETHRome 23 hackathon, focused n Privacy.

With Fluidkey ENS you can allow a user to receive a ENS name, that always resolves to a 
different address, controlled by the user. These addresses, called 
[Stealth Addresses](https://vitalik.ca/general/2023/01/20/stealth.html), can be used as 
burner addresses by the user, to receive a one-time payment. Through our UI, accessible via
[ethrome.fluidkey.com](https://ethrome.fluidkey.com/), a user can then see all the incoming payments within the same UI.

## Project creation

We've deployed our Offchain resolver n L1, and it's accessible at 
[0xabE739AF28742cA9B9Aa83E5A01439A66F0361E3](https://etherscan.io/address/0xabE739AF28742cA9B9Aa83E5A01439A66F0361E3).
You can find the codes and their deployment inside `contracts`.

The backend infrastructure is pure serverless, and you can fine the Infrastracture-as-a-code template
inside the `backend` folder.

The frontend is accessible on [ethrome.fluidkey.com](https://ethrome.fluidkey.com/) and it's the gateway for the
end user to subscribe and obtain an ENS subdomain. You can find the frontend code inside the `frontend` folder.
