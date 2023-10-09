import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Crowdfunding } from '../wrappers/Crowdfunding';
import '@ton-community/test-utils';

describe('Crowdfunding', () => {
    let blockchain: Blockchain;
    let crowdfunding: SandboxContract<Crowdfunding>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        crowdfunding = blockchain.openContract(await Crowdfunding.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await crowdfunding.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
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
