// libraries
import React, { useState } from "react";

// utilities
import { connect } from "../utils/connectWallet";
import { useContributorContext } from "../utils/context/contributor";
import {
    Creator,
    EthereumCurrencies,
    MumbaiCurrencies,
    MumbaiSuperCurrencies,
    PolygonCurrencies,
    PolygonSuperCurrencies,
} from "../utils/types";

// components
import Quote from "./Quote";

type Props = {
    coffee: string;
    plant: string;
    book: string;
    getTotal: (amount: boolean) => number;
    creator: Creator;
};

const PaymentSection = ({ coffee, plant, book, getTotal, creator }: Props) => {
    // contexts
    const { contributor, handleUpdateSigner } = useContributorContext();

    // states
    const [continuousPayment, setContinuousPayment] = useState(false);
    const [payIn, setPayIn] = useState<
        | PolygonCurrencies
        | PolygonSuperCurrencies
        | EthereumCurrencies
        | MumbaiCurrencies
        | MumbaiSuperCurrencies
    >(PolygonCurrencies.MATIC);

    return contributor ? (
        <div className="mt-5 flex w-full flex-col justify-center gap-5">
            <ul className="flex border-b border-gray-100">
                <li className="flex-1">
                    <div
                        className="relative block p-4"
                        onClick={() => setContinuousPayment(false)}
                    >
                        {!continuousPayment && (
                            <span className="absolute inset-x-0 -bottom-px h-px w-full bg-gray-400"></span>
                        )}

                        <div className="flex cursor-pointer items-center justify-center">
                            <span
                                className={`ml-3 ${
                                    !continuousPayment && "font-medium"
                                } text-gray-900`}
                            >
                                One time support
                            </span>
                        </div>
                    </div>
                </li>

                <li className="flex-1">
                    <div
                        className="relative block p-4"
                        onClick={() => setContinuousPayment(true)}
                    >
                        {continuousPayment && (
                            <span className="absolute inset-x-0 -bottom-px h-px w-full bg-gray-400"></span>
                        )}
                        <div className="flex cursor-pointer items-center justify-center">
                            <span
                                className={`ml-3 ${
                                    continuousPayment && "font-medium"
                                } text-gray-900`}
                            >
                                Continuous support
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
            <Quote
                coffee={coffee}
                plant={plant}
                book={book}
                contributor={contributor}
                getTotal={getTotal}
                payIn={payIn}
                setPayIn={setPayIn}
                continuousPayment={continuousPayment}
                creator={creator}
            />
        </div>
    ) : (
        <div className="group my-24 flex flex-col justify-center gap-5 py-3">
            <p className="text-center text-2xl font-medium">Connect wallet</p>
            <ul className="flex items-center justify-center gap-6">
                <li
                    className="cursor-pointer transition-transform ease-in-out hover:scale-125"
                    onClick={async () => {
                        const _signer = await connect(handleUpdateSigner);
                        handleUpdateSigner(_signer);
                    }}
                >
                    <img
                        src="/metamask.svg"
                        className="h-14 w-14"
                        alt="Metamask"
                    />
                </li>
                <li
                    className="cursor-pointer transition-transform ease-in-out hover:scale-125"
                    onClick={async () => {
                        const _signer = await connect(
                            handleUpdateSigner,
                            "custom-uauth"
                        );
                        handleUpdateSigner(_signer);
                    }}
                >
                    <img
                        src="/ud.svg"
                        className="h-14 w-14"
                        alt="Unstoppable Domains"
                    />
                </li>
            </ul>
        </div>
    );
};

export default PaymentSection;
