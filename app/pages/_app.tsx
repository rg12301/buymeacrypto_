import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { connect } from "../utils/connectWallet";
import { isEqual } from "lodash";
import { BigNumber, ethers } from "ethers";
import ContributorContext from "../utils/context/contributor";
import LoadingContext from "../utils/context/loading";
import { fetchContributorDetails } from "../utils/type_functions";
import { Contributor } from "../utils/types";

function MyApp({ Component, pageProps }: AppProps) {
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [contributor, setContributor] = useState<Contributor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const handleUpdateSigner = (signer_: ethers.Signer | null) => {
        if (!isEqual(signer, signer_)) {
            setSigner(signer_);
            if (signer_) {
                fetchContributorDetails(signer_).then((contributor_) => {
                    if (contributor_) {
                        setContributor(contributor_);
                    }
                });
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
