import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { CrowdfundingFactory } from '../wrappers/CrowdfundingFactory';
import { getUnixTimestampNow } from './utils';
import '@ton-community/test-utils';

const MIN_VALUE_TO_START = toNano('1');
const MAX_DEADLINE = 365 * 24 * 60 * 60;
const ONE_DAY: number = 1 * 24 * 60 * 60;

describe('CrowdfundingFactory', () => {
    let blockchain: Blockchain;
    let crowdfundingFactory: SandboxContract<CrowdfundingFactory>;
    let deployer: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        crowdfundingFactory = blockchain.openContract(await CrowdfundingFactory.fromInit());

        deployer = await blockchain.treasury('deployer');

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

    it('increase seqno after creating the crowdfunding', async () => {
        let seqno: bigint = await crowdfundingFactory.getGetLastSeqno();
        expect(seqno).toEqual(0n);

        await startCrowdfunding();

        seqno = await crowdfundingFactory.getGetLastSeqno();
        expect(seqno).toEqual(1n);
    });

    it("don't start crowdfunding if value is not enough", async () => {
        await crowdfundingFactory.send(
            deployer.getSender(),
            {
                value: MIN_VALUE_TO_START - toNano('0.01'),
            },
            {
                $$type: 'CrowdfundingParams',
                title: 'Test Title',
                description: 'Test Description',
                minContribution: toNano('0.01'),
                targetContribution: toNano('5'),
                deadline: BigInt(getUnixTimestampNow()),
                beneficiary: deployer.getSender().address,
            },
        );

        const seqno: bigint = await crowdfundingFactory.getGetLastSeqno();
        expect(seqno).toEqual(0n);
    });

    it("don't start crowdfunding if deadline is too big", async () => {
        await crowdfundingFactory.send(
            deployer.getSender(),
            {
                value: MIN_VALUE_TO_START,
            },
            {
                $$type: 'CrowdfundingParams',
                title: 'Test Title',
                description: 'Test Description',
                minContribution: toNano('0.01'),
                targetContribution: toNano('5'),
                deadline: BigInt(getUnixTimestampNow() + MAX_DEADLINE + ONE_DAY),
                beneficiary: deployer.getSender().address,
            },
        );

        const seqno: bigint = await crowdfundingFactory.getGetLastSeqno();
        expect(seqno).toEqual(0n);
    });

    const startCrowdfunding = async () => {
        await crowdfundingFactory.send(
            deployer.getSender(),
            {
                value: MIN_VALUE_TO_START,
            },
            {
                $$type: 'CrowdfundingParams',
                title: 'Test Title',
                description: 'Test Description',
                minContribution: toNano('0.01'),
                targetContribution: toNano('5'),
                deadline: BigInt(getUnixTimestampNow() + ONE_DAY),
                beneficiary: deployer.getSender().address,
            },
        );
    };
});
