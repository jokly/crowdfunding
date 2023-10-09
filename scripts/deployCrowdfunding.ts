import { toNano } from 'ton-core';
import { Crowdfunding } from '../wrappers/Crowdfunding';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const crowdfunding = provider.open(await Crowdfunding.fromInit());

    await crowdfunding.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(crowdfunding.address);

    // run methods on `crowdfunding`
}
