import { ethers } from "ethers";
import ERC20ABI from "./ERC20ABI.json";

export default async function send(
    signer: ethers.Signer,
    contract: string,
    amount: string,
    to: string
) {
    try {
        if (contract == "native") {
            let tx = {
                to: to,
                value: ethers.utils.parseEther(amount),
            };
            const tx_status = await (await signer.sendTransaction(tx)).wait();
            console.log(tx_status);
            return;
        }
        const ERC20Contract = new ethers.Contract(contract, ERC20ABI, signer);
        const tx = await ERC20Contract.connect(signer).transfer(
            to,
            ethers.utils.parseUnits(amount)
        );
        // const tx = await ERC20Contract.transfer(
        //     to,
        //     ethers.utils.parseUnits(amount)
        // );
        const tx_status = await tx.wait();
        console.log(tx_status);
    } catch (error) {
        console.log(error);
    }
}
