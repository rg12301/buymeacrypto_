// libraries
import { NextRouter } from "next/router";
import React, { ChangeEvent, SetStateAction, useEffect, useState } from "react";

// utilities
import { useLoadingContext } from "../utils/context/loading";
import { Creator } from "../utils/types";

// data
import default_creator from "../data/default_creator.json";
import CreatorProfile from "./CreatorProfile";
import PaymentSection from "./PaymentSection";

type Props = { router: NextRouter };

const RightPane = ({ router }: Props) => {
    // contexts
    const { loading, setLoading } = useLoadingContext();

    // states
    const [coffee, setCoffee] = useState("1");
    const [book, setBook] = useState("1");
    const [plant, setPlant] = useState("1");
    const [creator, setCreator] = useState<Creator>(default_creator);

    // handlers
    const getTotal = (amount = false) => {
        if (amount) {
            return Number(coffee) * 5 + Number(plant) * 10 + Number(book) * 15;
        }
        return Number(coffee) + Number(plant) + Number(book);
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
        cb: {
            (value: SetStateAction<string>): void;
            (value: SetStateAction<string>): void;
            (value: SetStateAction<string>): void;
            (arg0: string): void;
        }
    ) => {
        if (e.target.value == "") {
            cb((state) => {
                if (getTotal() - Number(state) + Number(e.target.value) > 0) {
                    return "0";
                }
                return "1";
            });
            return;
        }
        const rx = new RegExp(/\d/);
        if (rx.test(e.target.value)) {
            cb((state) => {
                if (getTotal() - Number(state) + Number(e.target.value) > 0) {
                    return Number(e.target.value).toString();
                }
                return state;
            });
        }
    };

    const handleQueryUpdate = () => {
        if (router.query) {
            const creator_from_url = router.query.creator;
            const coffee_from_url = router.query.coffee || "0";
            const plant_from_url = router.query.plant || "0";
            const book_from_url = router.query.book || "0";
            if (creator_from_url && typeof creator_from_url == "string") {
                const _creator = JSON.parse(creator_from_url) as Creator;
                setCreator(_creator);
            }
            if (
                (coffee_from_url || plant_from_url || book_from_url) &&
                Number(coffee_from_url) +
                    Number(plant_from_url) +
                    Number(book_from_url)
            ) {
                console.log(
                    Number(coffee_from_url) +
                        Number(plant_from_url) +
                        Number(book_from_url)
                );
                typeof coffee_from_url == "string" &&
                    setCoffee(coffee_from_url);
                typeof plant_from_url == "string" && setPlant(plant_from_url);
                typeof book_from_url == "string" && setBook(book_from_url);
            }
        }
        setLoading(false);
    };

    // effects
    useEffect(() => {
        if (router.isReady) {
            handleQueryUpdate();
        }
    }, [router.isReady]);

    return (
        <div className="h-full rounded-2xl bg-slate-50/50 py-20 lg:col-span-2">
            {loading ? (
                <div className="flex h-full w-full items-center justify-center gap-1 text-6xl">
                    <span className="animate-bounce-medium">.</span>
                    <span className="animate-bounce-fast">.</span>
                    <span className="animate-bounce-slow">.</span>
                </div>
            ) : (
                <div className="grid h-full grid-cols-4 gap-10">
                    <CreatorProfile creator={creator} />
                    <div className="col-span-2 flex items-center justify-center pr-20">
                        <div className="flex w-full flex-col items-center justify-center gap-y-10 px-10">
                            <div className="w-full">
                                <ul className="flex flex-col justify-center gap-3">
                                    <li className="flex items-center justify-between gap-8">
                                        <div className="h-10 w-10 rounded-full">
                                            <img
                                                src="/coffee.png"
                                                alt="coffee"
                                            />
                                        </div>
                                        <img
                                            src="/cross.png"
                                            className="h-4 w-4 text-gray-400"
                                        />
                                        <div className="relative">
                                            <input
                                                className="w-full rounded border-2 border-gray-200 py-3 pl-3 pr-12 text-sm"
                                                id="coffee"
                                                name="coffee"
                                                type="text"
                                                value={coffee}
                                                onChange={(e) => {
                                                    handleChange(e, setCoffee);
                                                }}
                                                placeholder="coffees"
                                                autoComplete="off"
                                                min="0"
                                                step="1"
                                            />
                                            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-500">
                                                $&nbsp;{Number(coffee) * 5}
                                            </span>
                                        </div>
                                    </li>
                                    <li className="flex items-center justify-between gap-8">
                                        <div className="h-10 w-10 rounded-full">
                                            <img src="/plant.png" alt="plant" />
                                        </div>
                                        <img
                                            src="/cross.png"
                                            className="h-4 w-4 text-gray-400"
                                        />
                                        <div className="relative">
                                            <input
                                                className="w-full rounded border-2 border-gray-200 py-3 pl-3 pr-12 text-sm"
                                                id="plant"
                                                name="plant"
                                                type="text"
                                                value={plant}
                                                onChange={(e) => {
                                                    handleChange(e, setPlant);
                                                }}
                                                placeholder="plants"
                                                min="0"
                                                step="1"
                                            />

                                            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-500">
                                                $&nbsp;{Number(plant) * 10}
                                            </span>
                                        </div>
                                    </li>
                                    <li className="ml-2 flex items-center justify-between gap-8">
                                        <div className="h-8 w-8 rounded-full">
                                            <img src="/book.png" alt="book" />
                                        </div>
                                        <img
                                            src="/cross.png"
                                            className="h-4 w-4 text-gray-400"
                                        />
                                        <div className="relative">
                                            <input
                                                className="w-full rounded border-2 border-gray-200 py-3 pl-3 pr-12 text-sm"
                                                id="book"
                                                name="book"
                                                type="text"
                                                value={book}
                                                onChange={(e) => {
                                                    handleChange(e, setBook);
                                                }}
                                                placeholder="books"
                                                min="0"
                                                step="1"
                                            />

                                            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-500">
                                                $&nbsp;{Number(book) * 15}
                                            </span>
                                        </div>
                                    </li>
                                    <li className="ml-2 flex items-center justify-end gap-8">
                                        <div className="hidden h-8 w-8 rounded-full">
                                            <img src="/book.png" alt="book" />
                                        </div>
                                        <img
                                            src="/cross.png"
                                            className="hidden h-4 w-4 text-gray-400"
                                        />
                                        <div className="relative">
                                            <input
                                                className="w-full rounded bg-gray-100 py-3 pl-3 pr-12 text-sm outline-none"
                                                id="total"
                                                aria-readonly
                                                type="text"
                                                value={getTotal()}
                                                readOnly
                                                placeholder="nil"
                                                min="0"
                                                step="1"
                                            />

                                            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-500">
                                                =&nbsp;&nbsp;$&nbsp;
                                                {getTotal(true)}
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <PaymentSection
                                coffee={coffee}
                                plant={plant}
                                book={book}
                                getTotal={getTotal}
                                creator={creator}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightPane;
function useRouter() {
    throw new Error("Function not implemented.");
}
