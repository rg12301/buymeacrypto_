import { ethers } from "ethers";

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

export type Creator = {
    ud?: string;
    wallet: string;
    profile?: string;
    portfolio?: string;
    about?: string;
    github?: string;
    twitter?: string;
    discord?: string;
    mail?: string;
    linkedin?: string;
};

export enum Currencies {
    POLYGON = "polygon",
    USDT = "usdt",
    USDC = "usdc",
    ETH = "ether",
}

export enum Chains {
    ETHEREUM = "1",
    POLYGON = "137",
    MUMBAI = "80001",
}

export type Currency = {
    name: string;
    symbol: string;
    contractAddress: string;
    logo: string;
};

export type Network = {
    [chainId in Chains]: {
        network: string;
        networkName: string;
        tokenName: string;
        rpcURL: string;
        blockExplorerURL: string;
        currencies: {
            [currency in Currencies]: Currency;
        };
    };
};

export type Contributor = {
    accountAddress: string;
    signer: ethers.Signer;
    chainId: Chains;
    balances: {
        [chainId in Chains]: {
            [currency in Currencies]?: BigInt;
        };
    };
};

export enum ERCStandards {
    ERC20 = "erc20",
    ERC721 = "erc721",
    ERC1155 = "erc1155",
    ERC777 = "erc777",
}

export type Token = {
    contract_decimals: number; //18
    contract_name: string; //'Ether'
    contract_ticker_symbol: string; //'ETH'
    contract_address: string; //'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    supports_erc: ERCStandards[] | null; // ['erc20']
    logo_url: string | null; //'https://www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png';
    last_transferred_at: string | null;
    type: "cryptocurrency" | "nft" | "dust" | "stablecoin" | null;
    balance: string | null; //'2543660422529725';
    balance_24h: string | null; //'2543660422529725';
    quote_rate: number | null; // 993.6847;
    quote_rate_24h: number | null; // 1086.517;
    quote: number | null; //  2.5275965;
    quote_24h: number | null; //  2.7637303;
    nft_data: null;
};

export type Cryptocurrency = {
    contract_decimals: number;
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    supports_erc: ERCStandards[] | null;
    logo_url: string;
    balance: string | null;
};
