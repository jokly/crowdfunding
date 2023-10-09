import { toNano } from 'ton-core';
import { CrowdfundingFactory } from '../wrappers/CrowdfundingFactory';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const crowdfundingFactory = provider.open(await CrowdfundingFactory.fromInit());

    await crowdfundingFactory.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(crowdfundingFactory.address);

    // run methods on `crowdfundingFactory`
}
