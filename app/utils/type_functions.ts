import { ethers } from "ethers";
import formatURL from "./formatURL";
import {
    Chains,
    Contributor,
    Ethereum,
    EthereumCurrencies,
    Mumbai,
    MumbaiCurrencies,
    MumbaiSuperCurrencies,
    Polygon,
    PolygonCurrencies,
    PolygonSuperCurrencies,
    Token,
    UDResponse,
    UDResponseResolved,
} from "./types";
import network from "../data/network.json";

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
    signer: ethers.Signer,
    address_: string,
    chainId_: number
): Promise<Contributor | null> {
    if (chainId_) {
        let contributor: Contributor | null = null;
        switch (chainId_) {
            case Chains.ETHEREUM: {
                let currencies: Ethereum["currencies"];
                Object.keys(network[Chains.ETHEREUM].currencies).forEach(
                    (currency) => {
                        if (
                            Object.keys(EthereumCurrencies).includes(currency)
                        ) {
                            currencies = {
                                ...currencies,
                                [currency]: {
                                    ...network[Chains.ETHEREUM].currencies[
                                        currency as EthereumCurrencies
                                    ],
                                    balance: 0,
                                    quote_rate: 1,
                                },
                            };
                            contributor = {
                                accountAddress: address_,
                                signer: signer,
                                network: {
                                    ...network[Chains.ETHEREUM],
                                    chainId: chainId_,
                                    currencies: currencies,
                                },
                            };
                        }
                    }
                );
                break;
            }
            case Chains.POLYGON: {
                let currencies: Polygon["currencies"];
                Object.keys(network[Chains.POLYGON].currencies).forEach(
                    (currency) => {
                        if (
                            Object.keys(PolygonCurrencies).includes(currency) ||
                            Object.keys(PolygonSuperCurrencies).includes(
                                currency
                            )
                        ) {
                            currencies = {
                                ...currencies,
                                [currency]: {
                                    ...network[Chains.POLYGON].currencies[
                                        currency as
                                            | PolygonCurrencies
                                            | PolygonSuperCurrencies
                                    ],
                                    balance: 0,
                                    quote_rate: 1,
                                },
                            };
                            contributor = {
                                accountAddress: address_,
                                signer: signer,
                                network: {
                                    ...network[Chains.POLYGON],
                                    chainId: chainId_,
                                    currencies: currencies,
                                },
                            };
                        }
                    }
                );
                break;
            }
            case Chains.MUMBAI: {
                let currencies: Mumbai["currencies"];
                Object.keys(network[Chains.MUMBAI].currencies).forEach(
                    (currency) => {
                        if (
                            Object.keys(MumbaiCurrencies).includes(currency) ||
                            Object.keys(MumbaiSuperCurrencies).includes(
                                currency
                            )
                        ) {
                            currencies = {
                                ...currencies,
                                [currency]: {
                                    ...network[Chains.MUMBAI].currencies[
                                        currency as
                                            | MumbaiCurrencies
                                            | MumbaiSuperCurrencies
                                    ],
                                    balance: 0,
                                    quote_rate: 1,
                                },
                            };
                            contributor = {
                                accountAddress: address_,
                                signer: signer,
                                network: {
                                    ...network[Chains.MUMBAI],
                                    chainId: chainId_,
                                    currencies: currencies,
                                },
                            };
                        }
                    }
                );
                break;
            }
            default:
                return contributor;
        }
        if (contributor)
            contributor = await updateContributorBalances(contributor);
        return contributor;
    }
    return null;
}

export async function updateContributorBalances(contributor: Contributor) {
    const result = await fetch("/api/covalent-api/fetch-token-balances", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            address: contributor.accountAddress,
            chain_id: contributor.network.chainId,
        }),
    });

    const tokens: Token[] = (await result.json()).tokens;
    for (const token of tokens) {
        Object.values(contributor.network.currencies).forEach(
            (currency, index) => {
                if (
                    currency.contractAddress == token.contract_address ||
                    currency.symbol == token.contract_ticker_symbol
                ) {
                    contributor.network.currencies = {
                        ...contributor.network.currencies,
                        [Object.keys(contributor.network.currencies)[index]]: {
                            ...currency,
                            balance: ethers.utils.formatUnits(
                                token.balance ? token.balance : 0
                            ),
                            quote_rate: token.quote_rate ? token.quote_rate : 1,
                        },
                    };
                }
            }
        );
    }
    Object.values(contributor.network.currencies).forEach((currency) => {
        if (currency.super) {
            // @ts-ignore
            contributor.network.currencies[currency.symbol].quote_rate =
                // @ts-ignore
                contributor.network.currencies[currency.super].quote_rate || 1;
        }
    });
    return contributor;
}

export function getDefaultCurrency(
    continuousPayment: boolean,
    chainId: Chains
):
    | PolygonCurrencies
    | PolygonSuperCurrencies
    | EthereumCurrencies
    | MumbaiCurrencies
    | MumbaiSuperCurrencies {
    switch (chainId) {
        case Chains.POLYGON:
            return continuousPayment
                ? PolygonCurrencies.MATIC
                : PolygonSuperCurrencies.MATICx;
        case Chains.ETHEREUM:
            return EthereumCurrencies.ETH;
        case Chains.MUMBAI:
            return continuousPayment
                ? MumbaiCurrencies.MATIC
                : MumbaiSuperCurrencies.MATICx;
    }
}
