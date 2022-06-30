import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { connect } from "../utils/connectWallet";
import { isEqual } from "lodash";
import { ethers } from "ethers";
import ContributorContext from "../utils/context/contributor";
import LoadingContext from "../utils/context/loading";
import { fetchContributorDetails } from "../utils/type_functions";
import { Contributor } from "../utils/types";

function MyApp({ Component, pageProps }: AppProps) {
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [contributor, setContributor] = useState<Contributor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const handleUpdateSigner = async (
        signer_: ethers.Signer | null
    ): Promise<void> => {
        if (!isEqual(signer, signer_)) {
            setSigner(signer_);
            if (signer_) {
                const address_ = await signer_.getAddress();
                const chainId_ = await signer_.getChainId();
                if (address_ && chainId_) {
                    fetchContributorDetails(signer_, address_, chainId_)
                        .then((contributor_) => {
                            if (contributor_) {
                                setContributor(contributor_);
                            }
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                }
            } else {
                setContributor(null);
            }
        }
    };

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
