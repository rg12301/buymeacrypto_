// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Token } from "../../../utils/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ tokens: Token[] } | null>
) {
    const address: string = req.body.address;
    const chainId: string = req.body.chain_id;
    if (address && chainId) {
        const COVALENT_API_GET_TOKEN_BALANCES_ENDPOINT = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=true&key=${process.env.COVALENT_API_KEY}`;
        try {
            const response = await fetch(
                `${COVALENT_API_GET_TOKEN_BALANCES_ENDPOINT}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                const tokens = (await response.json()).data.items as Token[];
                res.status(200).json({ tokens: tokens });
                return;
            }
        } catch (error) {
            res.status(500).send(null);
        }
    }
    res.status(400).send(null);
}
