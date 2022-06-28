// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { UDResponseResolved } from "../../../utils/types";
import { asUDResponseResolved } from "../../../utils/type_functions";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UDResponseResolved | null>
) {
    const UD_RECORDS_ENDPOINT = `https://unstoppabledomains.g.alchemy.com/domains/`;
    const domain: string = req.body.domain;
    if (domain) {
        try {
            const response = await fetch(`${UD_RECORDS_ENDPOINT}${domain}`, {
                headers: {
                    Authorization: `Bearer ${process.env.ALCHEMY_API_KEY}`,
                },
            });
            const ud_response = await response.json();
            const ud_resolved_response = asUDResponseResolved(ud_response);
            res.status(200).json(ud_resolved_response);
            return;
        } catch (error) {
            res.status(500).send(null);
        }
    }
    res.status(400).send(null);
}
