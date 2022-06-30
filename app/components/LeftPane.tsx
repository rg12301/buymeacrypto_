import makeBlockie from "ethereum-blockies-base64";
import { useTypewriter } from "react-simple-typewriter";
import React, { useState } from "react";
import { useContributorContext } from "../utils/context/contributor";
import { ethers } from "ethers";
import router from "next/router";
import { UDResponseResolved, Creator } from "../utils/types";
import { useLoadingContext } from "../utils/context/loading";

const LeftPane = () => {
    const { contributor, handleUpdateSigner } = useContributorContext();
    const { setLoading } = useLoadingContext();
    const { text, count } = useTypewriter({
        words: ["coffee", "book", "plant"],
        loop: 0,
        typeSpeed: 250,
        delaySpeed: 2000,
        deleteSpeed: 100,
    });

    const [searchUD, setSearchUD] = useState(false);
    const [searchValid, setSearchValid] = useState(false);
    const [search, setSearch] = useState("");
    const [UDDomainResolvedResult, setUDDomainResolvedResult] =
        useState<UDResponseResolved | null>(null);
    return (
        <div className="relative mx-16 flex h-full flex-col items-center justify-center gap-20">
            {contributor && (
                <div className="group absolute top-5 flex gap-5 py-3 px-6 opacity-20 transition-transform ease-in-out hover:opacity-100">
                    <div
                        className="h-14 w-14 cursor-pointer overflow-hidden rounded transition-transform ease-in-out group-hover:scale-110 group-hover:shadow-xl"
                        onClick={() => {
                            handleUpdateSigner(null);
                        }}
                    >
                        <img
                            src={makeBlockie(contributor.accountAddress)}
                            alt=""
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 text-xs font-medium">
                        <p className="font-mono font-semibold">
                            {`${contributor.accountAddress.substring(
                                0,
                                10
                            )}....${contributor.accountAddress.substring(
                                contributor.accountAddress.length - 10
                            )}`}
                        </p>
                        <ul className="flex justify-start gap-5">
                            {Object.values(contributor.network.currencies).map(
                                (coin) => {
                                    return (
                                        <li
                                            className="flex items-center gap-1"
                                            key={coin.contractAddress}
                                        >
                                            <img
                                                src={coin.logo}
                                                className="h-5 w-5"
                                                alt={coin.name}
                                            />
                                            <span>
                                                {coin.balance
                                                    .toString()
                                                    .substring(0, 4)}
                                            </span>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </div>
                </div>
            )}

            <span className="font-cursive text-4xl tracking-wider">
                buy me a crypto&nbsp;
                <span
                    className={`${
                        count % 3 == 0
                            ? "text-amber-700"
                            : count % 3 == 1
                            ? "text-violet-700"
                            : "text-green-600"
                    } font-medium`}
                >
                    {text}_
                </span>
            </span>
            <div className="w-full">
                <div className="relative">
                    <input
                        className="w-full rounded border-2 border-gray-200 py-3 pl-3 pr-12 text-sm"
                        id="search"
                        type="text"
                        value={search}
                        placeholder="search creators by wallet address or unstoppable domain"
                        autoComplete="off"
                        onChange={async (e) => {
                            setSearch(e.target.value);
                            if (e.target.value.length > 3) {
                                if (!e.target.value.startsWith("0x")) {
                                    !searchUD && setSearchUD(true);
                                    try {
                                        const res = await fetch(
                                            "api/ud/resolve-domain",
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type":
                                                        "application/json",
                                                },
                                                body: JSON.stringify({
                                                    domain: e.target.value,
                                                }),
                                            }
                                        );
                                        const result: UDResponseResolved =
                                            await res.json();
                                        setUDDomainResolvedResult(result);
                                        setSearchValid(true);
                                    } catch (error) {
                                        setUDDomainResolvedResult(null);
                                        setSearchValid(false);
                                    }
                                } else if (e.target.value.startsWith("0x")) {
                                    searchUD && setSearchUD(false);
                                    if (
                                        ethers.utils.isAddress(e.target.value)
                                    ) {
                                        setSearchValid(true);
                                    } else {
                                        setSearchValid(false);
                                    }
                                } else {
                                    setSearchValid(false);
                                }
                            }
                        }}
                    />
                    {search && (
                        <span
                            className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono ${
                                searchValid
                                    ? "font-bold text-green-600"
                                    : "text-gray-400 "
                            }`}
                        >
                            {search.length > 3 &&
                                (searchUD ? "UD" : "0xETH_ADDR")}
                        </span>
                    )}
                </div>

                <button
                    className="group relative mt-5 inline-flex w-full items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500 disabled:bg-gray-400/70"
                    onClick={async () => {
                        const _creator: Creator = UDDomainResolvedResult
                            ? {
                                  wallet: UDDomainResolvedResult.owner,
                                  ud: UDDomainResolvedResult.domain,
                              }
                            : {
                                  wallet: search,
                              };
                        console.log(_creator);
                        setLoading(true);
                        await router.push(`/`, {
                            query: {
                                coffee: 0,
                                plant: 1,
                                book: 0,
                                creator: JSON.stringify(_creator),
                            },
                        });
                        router.reload();
                    }}
                    disabled={!searchValid}
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
                        Search creator
                    </span>
                </button>
            </div>
        </div>
    );
};

export default LeftPane;
