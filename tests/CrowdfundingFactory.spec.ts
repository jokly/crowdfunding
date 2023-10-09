import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { CrowdfundingFactory } from '../wrappers/CrowdfundingFactory';
import '@ton-community/test-utils';

describe('CrowdfundingFactory', () => {
    let blockchain: Blockchain;
    let crowdfundingFactory: SandboxContract<CrowdfundingFactory>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        crowdfundingFactory = blockchain.openContract(await CrowdfundingFactory.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await crowdfundingFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: crowdfundingFactory.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and crowdfundingFactory are ready to use
    });
});
