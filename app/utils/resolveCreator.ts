import { UDResponseResolved } from "./types";
import { ethers } from "ethers";

export default async function resolveCreator(searchValue: string) {
    if (searchValue.endsWith(".eth")) {
        resolveENSDomain(searchValue);
    } else if (searchValue.includes(".")) {
        resolveUnstoppableDomain(searchValue);
    } else {
    }
}

async function resolveENSDomain(domain: string) {
    try {
        const provider = ethers.getDefaultProvider();
        const address = await provider.resolveName(domain);
        return address;
    } catch (error) {
        console.error(error);
    }
}

async function resolveUnstoppableDomain(domain: string) {
    try {
        const res = await fetch("api/ud/resolve-domain", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                domain: domain,
            }),
        });
        const result: UDResponseResolved = await res.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}
