import { ethers } from "ethers";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Contributor } from "../types";

const ContributorContext = createContext<{
    contributor: Contributor | null;
    handleUpdateSigner: (signer_: ethers.Signer | null) => Promise<void>;
}>({
    contributor: null,
    handleUpdateSigner: async () => {},
});

export function useContributorContext() {
    return useContext(ContributorContext);
}

export default ContributorContext;
