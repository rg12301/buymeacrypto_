export default function formatURL(url: string): string {
    if (url && !url.includes("http") && !url.includes("ipfs")) {
        url = `https://ipfs.io/ipfs/${url}`;
    } else if (url && url.includes("ipfs")) {
        const reguarExp = /ipfs:?\/+/;
        const hash = url.split(reguarExp)[1];
        url = `https://ipfs.io/ipfs/${hash}`;
    }
    return url;
}
