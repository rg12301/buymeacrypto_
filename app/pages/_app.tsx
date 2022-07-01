// libraries
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";
import { ethers } from "ethers";

// utilities
import { connect } from "../utils/connectWallet";
import ContributorContext from "../utils/context/contributor";
import LoadingContext from "../utils/context/loading";
import { fetchContributorDetails } from "../utils/type_functions";
import { Contributor } from "../utils/types";

function MyApp({ Component, pageProps }: AppProps) {
    // states
    const [contributor, setContributor] = useState<Contributor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // handlers
    const handleUpdateSigner = async (
        signer: ethers.Signer | null
    ): Promise<void> => {
        if (signer) {
            if (!contributor) {
                handleUpdateContributor(signer);
            } else {
                if (!isEqual(contributor.signer, signer)) {
                    handleUpdateContributor(signer);
                }
            }
        } else {
            contributor && setContributor(null);
        }
    };

    const handleUpdateContributor = async (signer: ethers.Signer) => {
        const address_ = await signer.getAddress();
        const chainId_ = await signer.getChainId();
        if (address_ && chainId_) {
            fetchContributorDetails(signer, address_, chainId_)
                .then((contributor_) => {
                    setContributor(contributor_);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    // effects
    useEffect(() => {
        const _connect = async () => {
            const _signer = await connect(handleUpdateSigner);
            if (_signer) {
                handleUpdateSigner(_signer);
            }
        };
        _connect();
    }, []);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            <ContributorContext.Provider
                value={{ contributor, handleUpdateSigner }}
            >
                <Component {...pageProps} />
            </ContributorContext.Provider>
        </LoadingContext.Provider>
    );
}

export default MyApp;
