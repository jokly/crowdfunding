import "@stdlib/deploy";
import "./crowdfunding.tact";

contract CrowdfundingFactory with Deployable {
    const MIN_VALUE_TO_START: Int = ton("1.0");
    const MAX_DEADLINE: Int = 31536000; // 1 year

    seqno: Int as uint256 = 0;

    init() {
    }

    receive(msg: CrowdfundingParams) {
        let ctx: Context = context();
        
        require(ctx.value >= self.MIN_VALUE_TO_START, "Not enough funds to start crowdfunding");
        require(msg.deadline - now() <= self.MAX_DEADLINE, "Deadline is too far in the future");

        let initCrowdfunding: StateInit = initOf Crowdfunding(myAddress(), self.seqno);
        let addressCrowdfunding: Address = contractAddress(initCrowdfunding);
        let start: StartCrowdfunding = StartCrowdfunding{
            creator: sender(),
            params: msg
        };

        send(SendParameters{
            to: addressCrowdfunding,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            code: initCrowdfunding.code,
            data: initCrowdfunding.data,
            body: start.toCell()
        });

        self.seqno = self.seqno + 1;
    }

    get fun getLastSeqno(): Int {
        return self.seqno;
    }

    get fun getCrowdfundingAddress(seqno: Int): Address {
        return contractAddress(initOf Crowdfunding(myAddress(), seqno));
    }
}
