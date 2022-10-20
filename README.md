# Simple local bridge
In two different terminals run:
- npx hardhat node
- npx hardhat node --port 8555

Created two smart contracts with counters (Sender & Receiver), deployed on two different chains.
Both contracts keep the counter in sync (WIP).
Script to deploy the contracts: `scripts/deploy_sender_receiver.ts`.
Script illustrating use case contracts: `scripts/sender_receiver_bridge.ts`.

The full implementation of this should have `scripts/sender_receiver_bridge.ts` connect to the Chain A with a websocket and listen for calls on the `Sender.start()` function. Everytime it is called, the script would try extract the nonce from the receipt and use that same nonce to call `Receiver.increment()`. The nonce is used to avoid double increments on the Receiver contract.

# Simple local bridge for Tokens
In two different terminals run:
- npx hardhat node
- npx hardhat node --port 8555

Created two Token smart contracts and two Bridge smart contracts, deployed on two different chains.
Chain A:
- Token A
- Bridge A
Chain B:
- Token B
- Chain B

Tokens A from Chain A can be bridged to Token B on Chain B.
A user can send send burn their TokenA on Chain A. An equivalent TokenB on chain B is created. And vice versa.

Script to deploy the contracts: `scripts/deploy_token_bridge.ts`.
Script illustrating use case contracts: `scripts/token_bridge.ts`. (WIP - still needs to be implemented).
