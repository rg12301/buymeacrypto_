import { ethers } from "ethers";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

const LoadingContext = createContext<{
    loading: boolean;
    setLoading: (loading_: boolean) => void;
}>({
    loading: true,
    setLoading: () => {},
});

export function useLoadingContext() {
    return useContext(LoadingContext);
}

export default LoadingContext;
