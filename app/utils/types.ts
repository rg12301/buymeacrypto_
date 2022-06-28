export type UDResponse = {
    records: UDRecords;
    meta: UDMeta;
};

type UDRecords = {
    "ipfs.html.value": string;
    "crypto.ADA.address": string;
    "crypto.BTC.address": string;
    "crypto.ETH.address": string;
    "gundb.username.value": string;
    "social.picture.value": string;
    "gundb.public_key.value": string;
    "ipfs.redirect_domain.value": string;
};

type UDMeta = {
    domain: string;
    blockchain: string;
    networkId: number;
    owner: string;
    resolver: string;
    registry: string;
};

export type UDResponseResolved = {
    domain: string;
    blockchain: string;
    networkId: number;
    owner: string;
    ipfs_html_value: string;
    ada: string;
    eth: string;
    social_picture: string;
};
