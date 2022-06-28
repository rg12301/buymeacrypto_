import formatURL from "./formatURL";
import { UDResponse, UDResponseResolved } from "./types";

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
