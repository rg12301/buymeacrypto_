// libraries
import {
    ConstantFlowAgreementV1,
    // Framework,
} from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

// utilities
import { Chains } from "./types";

// data
import network from "../data/network.json";

export default async function startStream(
    chainId: Chains,
    signer: ethers.Signer,
    sender: string,
    receiver: string,
    superTokenContractAddress: string,
    amountPerMonth: number
) {
    if (chainId == Chains.POLYGON || chainId == Chains.MUMBAI) {
        // const sf = await Framework.create({
        //     chainId: chainId, // you can also use chainId here instead
        //     provider: provider,
        // });

        const config = {
            resolverAddress: network[chainId].resolver,
            hostAddress: network[chainId].host,
            cfaV1Address: network[chainId].CFAv1,
            idaV1Address: network[chainId].IDAv1,
            governanceAddress: network[chainId].governance,
        };

        const cfaV1 = new ConstantFlowAgreementV1({ config: config });

        const txnResponse = await cfaV1
            .createFlow({
                sender: sender,
                receiver: receiver,
                superToken: superTokenContractAddress,
                flowRate: calculateFlowRate(amountPerMonth),
            })
            .exec(signer);
        const txnReceipt = await txnResponse.wait();
        console.log(txnReceipt);
    } else {
        throw new Error("request cannot be fulfilled on current network");
    }
}

function calculateFlowRate(amount: number) {
    const amountPerSecond = ethers.utils
        .parseEther(amount.toString())
        .div(2592000)
        .toString();
    console.log(amountPerSecond);
    return amountPerSecond;
}
