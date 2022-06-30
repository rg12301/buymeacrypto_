import React, { useEffect } from "react";
import {
    Chains,
    CommonCurrencies,
    Contributor,
    Currency,
    Ethereum,
    Mumbai,
    NativeCurrencies,
    Polygon,
} from "../utils/types";

type Props = {
    contributor: Contributor;
    payIn: CommonCurrencies | NativeCurrencies;
    setPayIn: (payIn: CommonCurrencies | NativeCurrencies) => void;
    getTotal: (amount: boolean) => number;
    continuousPayment: boolean;
};

const Quote = ({
    contributor,
    payIn,
    setPayIn,
    getTotal,
    continuousPayment,
}: Props) => {
    const setValidPayIn = (
        chainId: Chains,
        currency: CommonCurrencies | NativeCurrencies = CommonCurrencies.USDC
    ) => {
        if (chainId == Chains.POLYGON) {
            if (
                currency == CommonCurrencies.USDC ||
                currency == CommonCurrencies.USDT ||
                currency == NativeCurrencies.MATIC
            ) {
                setPayIn(currency);
            } else {
                setPayIn(CommonCurrencies.USDC);
            }
        } else if (chainId == Chains.ETHEREUM) {
            if (
                currency == CommonCurrencies.USDC ||
                currency == CommonCurrencies.USDT ||
                currency == NativeCurrencies.ETH
            ) {
                setPayIn(currency);
            } else {
                setPayIn(CommonCurrencies.USDC);
            }
        } else if (chainId == Chains.MUMBAI) {
            if (currency == NativeCurrencies.MATIC) {
                setPayIn(currency);
            } else {
                setPayIn(NativeCurrencies.MATIC);
            }
        }
    };

    const getValidCurrency = (
        contributor: Contributor,
        currency: CommonCurrencies | NativeCurrencies
    ): Currency | null => {
        const chainId = contributor.network.chainId;
        if (chainId == Chains.POLYGON) {
            if (
                currency == CommonCurrencies.USDC ||
                currency == CommonCurrencies.USDT ||
                currency == NativeCurrencies.MATIC
            ) {
                return (contributor.network as Polygon).currencies[currency];
            }
        } else if (chainId == Chains.ETHEREUM) {
            if (
                currency == CommonCurrencies.USDC ||
                currency == CommonCurrencies.USDT ||
                currency == NativeCurrencies.ETH
            ) {
                return (contributor.network as Ethereum).currencies[currency];
            }
        } else if (chainId == Chains.MUMBAI) {
            if (currency == NativeCurrencies.MATIC) {
                return (contributor.network as Mumbai).currencies[currency];
            }
        }
        return null;
    };

    useEffect(() => {
        if (contributor) {
            setValidPayIn(contributor.network.chainId);
        }
    }, [contributor]);

    return (
        <>
            <div className="mt-5 flex items-center justify-between gap-8">
                <span className="font-semibold">Pay in</span>
                <ul className="flex items-center justify-center gap-5">
                    {Object.values(contributor.network.currencies).map(
                        (coin) => {
                            return (
                                <li
                                    key={coin.contractAddress}
                                    className={`h-10 w-10 cursor-pointer rounded-full transition-transform duration-200 ease-in-out ${
                                        payIn == coin.symbol &&
                                        "scale-150 shadow-xl"
                                    }`}
                                    onClick={() =>
                                        setValidPayIn(
                                            contributor.network.chainId,
                                            coin.symbol as
                                                | NativeCurrencies
                                                | CommonCurrencies
                                        )
                                    }
                                >
                                    <img src={coin.logo} alt={coin.name} />
                                </li>
                            );
                        }
                    )}
                </ul>
            </div>
            <div className="mt-5 flex flex-col items-center justify-center">
                <div className="w-full">
                    <p className="flex items-center justify-between gap-10 text-sm">
                        <span>{`${payIn}${
                            continuousPayment ? "x" : ""
                        }/USD`}</span>
                        <span className="font-semibold">
                            {getValidCurrency(contributor, payIn)
                                ?.quote_rate.toString()
                                .substring(0, 6) || "nil"}
                        </span>
                    </p>
                    <p className="flex items-center justify-between gap-10 text-sm">
                        <span>{`Amount to be paid in USD`}</span>
                        <span className="font-semibold">{getTotal(true)}</span>
                    </p>
                    <p className="flex items-center justify-between gap-10 text-sm">
                        <span>{`Amount to be paid in ${payIn}${
                            continuousPayment ? "x" : ""
                        }/month`}</span>
                        <span className="font-semibold">
                            {(
                                getTotal(true) /
                                (getValidCurrency(contributor, payIn)
                                    ?.quote_rate || 1)
                            ).toFixed(3)}
                        </span>
                    </p>
                    <p className="flex items-center justify-between gap-10 text-sm">
                        <span>{`Your ${payIn}${
                            continuousPayment ? "x" : ""
                        } balance`}</span>
                        <span className="font-semibold">
                            {getValidCurrency(contributor, payIn)
                                ?.balance.toString()
                                .substring(0, 6) || "nil"}
                        </span>
                    </p>
                </div>
                <button className="group relative mt-5 inline-flex w-full items-center overflow-hidden rounded bg-green-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-green-500">
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
            </div>
        </>
    );
};

export default Quote;
