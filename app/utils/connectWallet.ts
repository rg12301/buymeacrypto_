import { ethers } from "ethers";
import Web3Modal from "web3modal";

const providerOptions = {
    /* See Provider Options Section */
};

export async function connect(
    cb: (signer: ethers.Signer | null) => Promise<void>
) {
    const web3Modal = new Web3Modal();
    try {
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection, "any");

        // Subscribe to accounts change
        connection.on("accountsChanged", async (accounts: string[]) => {
            console.log(accounts);
            if (accounts.length > 0) {
                const signer = provider.getSigner();
                await cb(signer);
            }
        });

        // Subscribe to chainId change
        connection.on("chainChanged", async (chainId: number) => {
            console.log(chainId);
            const signer = provider.getSigner();
            await cb(signer);
        });

        // Subscribe to provider connection
        connection.on("connect", async (info: { chainId: number }) => {
            console.log(info);
            const signer = provider.getSigner();
            await cb(signer);
        });

        // Subscribe to provider disconnection
        connection.on(
            "disconnect",
            async (error: { code: number; message: string }) => {
                console.log(error);
            }
        );
        return provider.getSigner();
    } catch (error) {
        console.log(error);
    }
    return null;
}
