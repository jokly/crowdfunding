# Crowdfunding

## Introduction

This project is a decentralized crowdfunding application built on the TON blockchain using smart contracts. It allows users to create crowdfunding campaigns, view campaign details, contribute to campaigns, and manage the lifecycle of the campaign based on the contribution goals and deadlines.

## Features

1. **Start Crowdfunding.**
   Users can initiate a crowdfunding campaign by deploying the smart contract with the necessary campaign details.

2. **View Crowdfunding Info.**
   Anyone can view the details of ongoing crowdfunding campaigns, including the target amount, deadline, beneficiary, and current contributions.

3. **Contribute.**
   Anyone can contribute funds to a specific crowdfunding campaign by sending the desired amount to the smart contract.

4. **Beneficiary Withdrawal.**
   If the target amount is fulfilled within the specified deadline, the beneficiary can withdraw the funds raised for the campaign.

5. **Contributor Refund.**
   Contributors have the option to request a refund of their contributed amount if the project expires.

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

-   `yarn build` - build all contracts
-   `yarn lint` - lint TypeScript code
-   `yarn lint:fix` - fix linter errors
-   `yarn test` - run tests for contracts

## Development

### VS Code

Extensions:

-   [TACT](https://marketplace.visualstudio.com/items?itemName=KonVik.tact-lang-vscode)
-   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
-   [Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)
