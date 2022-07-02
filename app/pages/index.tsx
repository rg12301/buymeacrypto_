import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";

const Home: NextPage = () => {
    const router = useRouter();
    return (
        <div className="grid min-h-screen w-full grid-cols-1 items-center justify-center text-gray-700 md:grid-cols-2 lg:grid-cols-3">
            <Head>
                <title>buymeacrypto_</title>
                <meta
                    name="description"
                    content="A web3 platform to get support from your followers/audience/consumers/fans via cryptocurrency based digital payments. There are no intermediary institutions to process the transactions. Payment choices includes a set of widely used ERC20 coins(like USDC) on Polygon and Ethereum chains, thus is reliable and secure. This platform is completely free to use and open to contribute."
                />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>
            <LeftPane />
            <RightPane router={router} />
        </div>
    );
};

export default Home;
