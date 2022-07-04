// libraries
import makeBlockie from "ethereum-blockies-base64";
import React, { useEffect, useState } from "react";

// utilities
import send from "../utils/send";
import startStream from "../utils/startStream";
import {
    Chains,
    Contributor,
    Creator,
    Currency,
    Ethereum,
    EthereumCurrencies,
    Mumbai,
    MumbaiCurrencies,
    MumbaiSuperCurrencies,
    Polygon,
    PolygonCurrencies,
    PolygonSuperCurrencies,
} from "../utils/types";
import { getDefaultCurrency } from "../utils/type_functions";

type Props = {
    coffee: string;
    plant: string;
    book: string;
    contributor: Contributor;
    payIn:
        | PolygonCurrencies
        | PolygonSuperCurrencies
        | EthereumCurrencies
        | MumbaiCurrencies
        | MumbaiSuperCurrencies;
    setPayIn: (
        payIn:
            | PolygonCurrencies
            | PolygonSuperCurrencies
            | EthereumCurrencies
            | MumbaiCurrencies
            | MumbaiSuperCurrencies
    ) => void;
    getTotal: (amount: boolean) => number;
    continuousPayment: boolean;
    creator: Creator;
};

const Quote = ({
    coffee,
    plant,
    book,
    contributor,
    payIn,
    setPayIn,
    getTotal,
    continuousPayment,
    creator,
}: Props) => {
    // handlers
    const setValidPayIn = (
        chainId: Chains,
        currency:
            | PolygonCurrencies
            | PolygonSuperCurrencies
            | EthereumCurrencies
            | MumbaiCurrencies
            | MumbaiSuperCurrencies = getDefaultCurrency(
            continuousPayment,
            chainId
        )
    ): boolean => {
        if (continuousPayment) {
            if (chainId == Chains.POLYGON) {
                if (Object.keys(PolygonSuperCurrencies).includes(currency)) {
                    setPayIn(currency);
                    return true;
                }
            } else if (chainId == Chains.ETHEREUM) {
                if (Object.keys(EthereumCurrencies).includes(currency)) {
                    setPayIn(currency);
                    return true;
                }
            } else if (chainId == Chains.MUMBAI) {
                if (Object.keys(MumbaiSuperCurrencies).includes(currency)) {
                    setPayIn(currency);
                    return true;
                }
            }
        } else {
            if (chainId == Chains.POLYGON) {
                if (Object.keys(PolygonCurrencies).includes(currency)) {
                    setPayIn(currency);
                    return true;
                }
            } else if (chainId == Chains.ETHEREUM) {
                if (Object.keys(EthereumCurrencies).includes(currency)) {
                    setPayIn(currency);
                    return true;
                }
            } else if (chainId == Chains.MUMBAI) {
                if (Object.keys(MumbaiCurrencies).includes(currency)) {
                    setPayIn(currency);
                    return true;
                }
            }
        }
        return false;
    };

    const getValidCurrency = (
        contributor: Contributor,
        currency:
            | PolygonCurrencies
            | PolygonSuperCurrencies
            | EthereumCurrencies
            | MumbaiCurrencies
            | MumbaiSuperCurrencies
    ): Currency<typeof currency> | null => {
        const chainId = contributor.network.chainId;
        if (chainId == Chains.POLYGON) {
            if (
                Object.keys(PolygonCurrencies).includes(currency) ||
                Object.keys(PolygonSuperCurrencies).includes(currency)
            ) {
                return (contributor.network as Polygon).currencies[
                    currency as PolygonCurrencies | PolygonSuperCurrencies
                ];
            }
        } else if (chainId == Chains.ETHEREUM) {
            if (Object.keys(EthereumCurrencies).includes(currency)) {
                return (contributor.network as Ethereum).currencies[
                    currency as EthereumCurrencies
                ];
            }
        } else if (chainId == Chains.MUMBAI) {
            if (
                Object.keys(MumbaiCurrencies).includes(currency) ||
                Object.keys(MumbaiSuperCurrencies).includes(currency)
            ) {
                return (contributor.network as Mumbai).currencies[
                    currency as MumbaiCurrencies | MumbaiSuperCurrencies
                ];
            }
        }
        return null;
    };

    const handleInsufficientBalance = () => {
        const payableAmount = getTotal(true) / (validCurrency?.quote_rate || 1);
        const balance = validCurrency?.balance || 0;
        if (balance >= payableAmount) {
            setSufficientBalance(true);
        } else {
            setSufficientBalance(false);
        }
    };

    // states
    const [sufficientBalance, setSufficientBalance] = useState(false);
    const [validCurrency, setValidCurrency] = useState<Currency<
        | PolygonCurrencies
        | PolygonSuperCurrencies
        | EthereumCurrencies
        | MumbaiCurrencies
        | MumbaiSuperCurrencies
    > | null>(null);

    // effects
    useEffect(() => {
        handleInsufficientBalance();
    }, [validCurrency, coffee, plant, book]);

    useEffect(() => {
        const currency = getValidCurrency(contributor, payIn);
        setValidCurrency(currency);
    }, [payIn]);

    useEffect(() => {
        if (contributor) {
            if (contributor.network.chainId == Chains.ETHEREUM) {
                setValidPayIn(contributor.network.chainId, payIn);
            } else {
                setValidPayIn(
                    contributor.network.chainId,
                    (continuousPayment
                        ? `${payIn}x`
                        : `${payIn.substring(0, payIn.length - 1)}`) as
                        | PolygonCurrencies
                        | PolygonSuperCurrencies
                        | MumbaiCurrencies
                        | MumbaiSuperCurrencies
                );
            }
        }
    }, [continuousPayment]);

    useEffect(() => {
        setValidPayIn(contributor.network.chainId);
    }, [contributor]);

    const paymentModes = Object.values(contributor.network.currencies).map(
        (coin) => {
            if (continuousPayment) {
                if (!coin.super) {
                    return;
                }
            } else {
                if (coin.super) {
                    return;
                }
            }
            return (
                <li
                    key={coin.symbol}
                    className={`relative cursor-pointer`}
                    onClick={() =>
                        setValidPayIn(contributor.network.chainId, coin.symbol)
                    }
                >
                    <img
                        src={
                            coin.logo
                                ? coin.logo
                                : makeBlockie(coin.contractAddress)
                        }
                        alt={coin.name}
                        className={`h-10 w-10 overflow-hidden rounded-full transition-transform duration-200 ease-in-out ${
                            payIn == coin.symbol && "scale-150 shadow-xl"
                        }`}
                    />
                    {coin.super && (
                        <div
                            className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                payIn == coin.symbol &&
                                "translate-x-2 translate-y-2"
                            }`}
                        >
                            <img src="/superfluid-finance.svg" />
                        </div>
                    )}
                </li>
            );
        }
    );

    return paymentModes.filter((item) => (item ? true : false)).length > 0 ? (
        <>
            <div className="mt-2 flex items-center justify-between gap-8">
                <span className="font-semibold">Pay in</span>
                <ul className="flex items-center justify-center gap-5">
                    {paymentModes}
                </ul>
            </div>
            <div className="flex flex-col items-center justify-center">
                <div className="w-full">
                    <p className="flex items-center justify-between gap-10 text-sm">
                        <span>{`${payIn}/USD`}</span>
                        <span className="font-semibold">
                            {validCurrency?.quote_rate.toFixed(3) || "na"}
                        </span>
                    </p>
                    <p className="flex items-center justify-between gap-10 text-sm">
                        <span>{`Amount to be paid in USD`}</span>
                        <span className="font-semibold">
                            {getTotal(true).toFixed(2)}
                        </span>
                    </p>
                    <p className="flex items-center justify-between gap-10 text-sm">
                        <span>{`Amount to be paid in ${payIn}${
                            continuousPayment ? "/month" : ""
                        }`}</span>
                        <span className="font-semibold">
                            {(
                                getTotal(true) /
                                (validCurrency?.quote_rate || 1)
                            ).toFixed(3)}
                        </span>
                    </p>
                    <p className="flex items-center justify-between gap-10 text-sm">
                        <span>{`Your ${payIn} balance`}</span>
                        <span className="font-semibold">
                            {Number(validCurrency?.balance).toFixed(3) || "na"}
                        </span>
                    </p>
                </div>
                {sufficientBalance ? (
                    <button
                        className="group relative mt-5 inline-flex w-full items-center overflow-hidden rounded bg-green-600 px-8 py-3 text-white outline-none focus:outline-none active:bg-green-500"
                        onClick={
                            continuousPayment
                                ? () => {
                                      const amount =
                                          getTotal(true) /
                                          (validCurrency?.quote_rate || 1);
                                      if (amount && validCurrency) {
                                          startStream(
                                              contributor.network.chainId,
                                              contributor.signer,
                                              contributor.accountAddress,
                                              creator.wallet,
                                              validCurrency?.contractAddress,
                                              amount
                                          );
                                      }
                                  }
                                : () => {
                                      const contractAddr =
                                          validCurrency?.contractAddress;
                                      const amount = (
                                          getTotal(true) /
                                          (validCurrency?.quote_rate || 1)
                                      ).toString();
                                      if (contractAddr && amount) {
                                          send(
                                              contributor.signer,
                                              contractAddr,
                                              amount,
                                              creator.wallet
                                          );
                                      }
                                  }
                        }
                    >
                        <span className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4">
                            <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </span>
                        <span className="font-semibold transition-all group-hover:mr-4">
                            {continuousPayment ? "Start streaming" : "Send"}
                        </span>
                    </button>
                ) : (
                    <button className="group relative  mt-5 inline-flex w-full items-center overflow-hidden rounded bg-red-300 px-8 py-3 text-white outline-none focus:outline-none">
                        <span className="absolute right-0 translate-x-full opacity-0 transition-transform group-hover:-translate-x-4">
                            <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </span>
                        <span className="font-semibold transition-all group-hover:mr-4">
                            Insufficient balance
                        </span>
                    </button>
                )}
            </div>
        </>
    ) : (
        <div>
            <h3 className="my-[5.25rem] flex items-center justify-center gap-5 px-5 text-center text-lg font-medium">
                <span className="text-5xl">!</span>
                <span>Unsupported Network</span>
            </h3>
        </div>
    );
};

export default Quote;
