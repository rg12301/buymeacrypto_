import { ethers } from "ethers";
import Web3Modal from "web3modal";

const providerOptions = {
    /* See Provider Options Section */
};

export async function connect(cb: (signer: ethers.Signer | null) => void) {
    const web3Modal = new Web3Modal();
    try {
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection, "any");

        // Subscribe to accounts change
        connection.on("accountsChanged", (accounts: string[]) => {
            console.log(accounts);
            if (accounts.length > 0) {
                const signer = provider.getSigner();
                cb(signer);
            }
        });

        // Subscribe to chainId change
        connection.on("chainChanged", (chainId: number) => {
            console.log(chainId);
            const signer = provider.getSigner();
            cb(signer);
        });

        // Subscribe to provider connection
        connection.on("connect", (info: { chainId: number }) => {
            console.log(info);
            const signer = provider.getSigner();
            cb(signer);
        });

        // Subscribe to provider disconnection
        connection.on(
            "disconnect",
            (error: { code: number; message: string }) => {
                console.log(error);
                cb(null);
            }
        );
        return provider.getSigner();
    } catch (error) {
        console.log(error);
    }
    return null;
}
