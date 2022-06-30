import React from "react";
import makeBlockie from "ethereum-blockies-base64";
import Link from "next/link";
import { useContributorContext } from "../utils/context/contributor";
import { Creator } from "../utils/types";

type Props = {
    creator: Creator;
};

const CreatorProfile = ({ creator }: Props) => {
    return (
        <div className="group col-span-2 flex flex-col items-center justify-center gap-3 pl-20">
            <img
                src={
                    creator.profile
                        ? creator.profile
                        : makeBlockie(creator.wallet)
                }
                alt="profile"
                className="mx-auto h-40 w-40 rounded-xl object-cover"
            />

            <blockquote className="flex flex-col justify-between px-10 text-center">
                {creator.ud && (
                    <p className="text-lg font-semibold">{creator.ud}</p>
                )}
                <p className="mt-1 font-mono text-sm font-medium">
                    {creator.wallet}
                </p>
                <ul className="mt-3 flex justify-center gap-3">
                    {creator.github && (
                        <li className="cursor-pointer hover:animate-pulse">
                            <Link href={creator.github}>
                                <img
                                    src={"/github.svg"}
                                    alt={"github"}
                                    width={25}
                                    height={25}
                                />
                            </Link>
                        </li>
                    )}
                    {creator.twitter && (
                        <li className="cursor-pointer hover:animate-pulse">
                            <Link href={creator.twitter}>
                                <img
                                    src={"/twitter.svg"}
                                    alt={"twitter"}
                                    width={30}
                                    height={30}
                                />
                            </Link>
                        </li>
                    )}
                    {creator.mail && (
                        <li className="cursor-pointer hover:animate-pulse">
                            <Link href={`mailto:${creator.mail}`}>
                                <img
                                    src={"/gmail.svg"}
                                    alt={"gmail"}
                                    width={25}
                                    height={25}
                                />
                            </Link>
                        </li>
                    )}
                </ul>
                {creator.about && (
                    <p className="mt-6 flex max-w-sm gap-1 text-gray-700">
                        <span className="transform text-5xl opacity-0 transition-transform delay-200 group-hover:-translate-y-2 group-hover:opacity-100">
                            “
                        </span>
                        <span className="text-center text-sm italic">
                            {creator.about}
                        </span>
                        <span className="transform self-end text-5xl opacity-0 transition-transform delay-200 group-hover:translate-y-2 group-hover:opacity-100">
                            ”
                        </span>
                    </p>
                )}
            </blockquote>
        </div>
    );
};

export default CreatorProfile;
