import "@stdlib/deploy";
import "./crowdfunding.tact";

message StartCrowdfunding {
    params: CrowdfundingParams;
}

contract CrowdfundingFactory with Deployable {
    const MIN_VALUE_TO_START: Int = ton("1.0");
    const MAX_DEADLINE: Int = 31536000; // 1 year

    crowdfundings: map<Address, Bool>;

    init() {
        self.crowdfundings = emptyMap();
    }

    receive(msg: StartCrowdfunding) {
        let ctx: Context = context();
        
        require(ctx.value >= self.MIN_VALUE_TO_START, "Not enough funds to start crowdfunding");
        require(msg.params.deadline - now() <= self.MAX_DEADLINE, "Deadline is too far in the future");

        let initCrowdfunding: StateInit = initOf Crowdfunding(sender(), msg.params);
        let addressCrowdfunding: Address = contractAddress(initCrowdfunding);

        let savedCrowdfunding: Bool? = self.crowdfundings.get(addressCrowdfunding);
        require(savedCrowdfunding == null, "Crowdfunding with such params already exists");

        send(SendParameters{
            to: addressCrowdfunding,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            code: initCrowdfunding.code,
            data: initCrowdfunding.data,
            body: Deploy{queryId: 0}.toCell()
        });

        self.crowdfundings.set(addressCrowdfunding, true);
    }

    get fun crowdfundings(): map<Address, Bool> {
        return self.crowdfundings;
    }
}
