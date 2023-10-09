import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Crowdfunding } from '../wrappers/Crowdfunding';
import '@ton-community/test-utils';
import { getUnixTimestampNow } from './utils';

describe('Crowdfunding', () => {
    let blockchain: Blockchain;
    let crowdfunding: SandboxContract<Crowdfunding>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const deployer = await blockchain.treasury('deployer');

        crowdfunding = blockchain.openContract(
            await Crowdfunding.fromInit(deployer.getSender().address, {
                $$type: 'CrowdfundingParams',
                title: 'MyTitle',
                description: 'MyDescription',
                targetContribution: toNano('100'),
                minContribution: toNano('0.1'),
                deadline: BigInt(getUnixTimestampNow()),
                beneficiary: deployer.getSender().address,
            }),
        );

        const deployResult = await crowdfunding.send(
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
            to: crowdfunding.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and crowdfunding are ready to use
    });
});
