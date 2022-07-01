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

export enum PolygonCurrencies {
    MATIC = "MATIC",
    USDC = "USDC",
    USDT = "USDT",
}

export enum PolygonSuperCurrencies {
    MATICx = "MATICx",
    USDCx = "USDCx",
}

export enum EthereumCurrencies {
    ETH = "ETH",
    USDC = "USDC",
    USDT = "USDT",
}

export enum MumbaiCurrencies {
    MATIC = "MATIC",
    fUSDC = "fUSDC",
}

export enum MumbaiSuperCurrencies {
    MATICx = "MATICx",
    fUSDCx = "fUSDCx",
}

export enum Chains {
    ETHEREUM = 1,
    POLYGON = 137,
    MUMBAI = 80001,
}

export type Currency<
    T extends
        | PolygonCurrencies
        | PolygonSuperCurrencies
        | EthereumCurrencies
        | MumbaiCurrencies
        | MumbaiSuperCurrencies
> = {
    name: string;
    symbol: T;
    contractAddress: string;
    logo: string;
    balance: number;
    quote_rate: number;
    super?: T;
};

export type Network = {
    chainId: Chains;
    network: string;
    networkName: string;
    tokenName: string;
    rpcURL: string;
    blockExplorerURL: string;
};

export interface Polygon extends Network {
    currencies: {
        [currency in
            | PolygonCurrencies
            | PolygonSuperCurrencies]: Currency<currency>;
    };
}

export interface Ethereum extends Network {
    currencies: {
        [currency in EthereumCurrencies]: Currency<currency>;
    };
}

export interface Mumbai extends Network {
    currencies: {
        [currency in
            | MumbaiCurrencies
            | MumbaiSuperCurrencies]: Currency<currency>;
    };
}

export type Contributor = {
    accountAddress: string;
    signer: ethers.Signer;
    network: Polygon | Ethereum | Mumbai;
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
