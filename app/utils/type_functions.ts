import { ethers } from "ethers";
import formatURL from "./formatURL";
import network from "../data/network.json";
import {
    Chains,
    Contributor,
    Currencies,
    Network,
    Token,
    UDResponse,
    UDResponseResolved,
} from "./types";

const network_typed = network as Network;

export function asUDResponseResolved(res: UDResponse): UDResponseResolved {
    const result: UDResponseResolved = {
        ada: res.records["crypto.ADA.address"],
        blockchain: res.meta.blockchain,
        domain: res.meta.domain,
        eth: res.records["crypto.ETH.address"],
        ipfs_html_value: formatURL(res.records["ipfs.html.value"]),
        networkId: res.meta.networkId,
        owner: res.meta.owner,
        social_picture: formatURL(res.records["social.picture.value"]),
    };
    return result;
}

export async function fetchContributorDetails(
    signer: ethers.Signer
): Promise<Contributor | null> {
    const chainId = (await signer.getChainId()).toString();
    if (
        chainId == Chains.ETHEREUM ||
        chainId == Chains.POLYGON ||
        chainId == Chains.MUMBAI
    ) {
        const contributor: Contributor = {
            accountAddress: await signer.getAddress(),
            chainId: chainId,
            signer: signer,
            balances: { "1": {}, "137": {}, "80001": {} },
        };

        return Promise.all(
            Object.keys(Chains).map(async (chain, chain_index) => {
                const result = await fetch(
                    "/api/covalent-api/fetch-token-balances",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            address: contributor.accountAddress,
                            chain_id: Object.values(Chains)[chain_index],
                        }),
                    }
                );
                const tokens: Token[] = (await result.json()).tokens;
                tokens.map((token) => {
                    Object.keys(Currencies).map((currency, currency_index) => {
                        if (
                            network_typed[Object.values(Chains)[chain_index]] &&
                            network_typed[Object.values(Chains)[chain_index]]
                                .currencies[
                                Object.values(Currencies)[currency_index]
                            ]
                        ) {
                            // console.log(
                            //     Object.values(Chains)[chain_index],
                            //     Object.values(Currencies)[currency_index]
                            // );
                            if (
                                token.contract_address ==
                                    network_typed[
                                        Object.values(Chains)[chain_index]
                                    ].currencies[
                                        Object.values(Currencies)[
                                            currency_index
                                        ]
                                    ].contractAddress ||
                                token.contract_ticker_symbol ==
                                    network_typed[
                                        Object.values(Chains)[chain_index]
                                    ].currencies[
                                        Object.values(Currencies)[
                                            currency_index
                                        ]
                                    ].symbol
                            ) {
                                if (token.balance)
                                    contributor.balances[
                                        Object.values(Chains)[chain_index]
                                    ][
                                        Object.values(Currencies)[
                                            currency_index
                                        ]
                                    ] = BigInt(token.balance);
                            }
                        }
                    });
                });
            })
        )
            .then(() => {
                console.log(contributor);
                return contributor;
            })
            .catch(() => {
                return null;
            });
    }
    return null;
}
