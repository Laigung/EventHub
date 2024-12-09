import React, { useCallback } from "react";
import { createContext, useEffect, useState } from "react";
import { Contract, Web3 } from "web3";
import { contractABI, contractAddress } from "./contract";
import { IEvent, IUser } from "./types";

type Web3ContextType = {
  web3?: Web3;
  contract?: Contract<typeof contractABI>;
  // metamask-related
  requestAccounts: () => Promise<void>;
  accounts: string[];
  connectedAccount?: string;
  setConnectedAccount: (
    value: React.SetStateAction<string | undefined>
  ) => void;
  allBalances: Record<string, string>;
  currentBalance: string;
  // EventHub account-related
  user?: IUser;
  refreshUserInfo: () => void;
  isUserInfoLoading: boolean;
  // state-related
  events: IEvent[];
  setEvents: (value: React.SetStateAction<IEvent[]>) => void;
  refreshEvents: () => Promise<void>;
  isEventLoading: boolean;
};

// Default context value
const defaultWeb3Context: Web3ContextType = {
  refreshUserInfo: () => {},
  isUserInfoLoading: false,
  requestAccounts: async () => {},
  accounts: [],
  allBalances: {},
  connectedAccount: undefined,
  setConnectedAccount: () => {},
  currentBalance: "loading...",
  events: [],
  setEvents: () => {},
  refreshEvents: () => {
    return new Promise((resolve, reject) => {});
  },
  isEventLoading: false,
};

const Web3Context = createContext<Web3ContextType>(defaultWeb3Context);

export default function Web3ContextProvider({
  children,
}: React.PropsWithChildren) {
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract<typeof contractABI>>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [allBalances, setAllBalances] = useState<Record<string, string>>({});
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [currentBalance, setCurrentBalance] = useState<string>("loading...");

  const [user, setUser] = useState<IUser>();
  const [isUserInfoLoading, setIsUserInfoLoading] = useState<boolean>(false);

  const [events, setEvents] = useState<IEvent[]>([]);
  const [isEventLoading, setIsEventLoading] = useState<boolean>(false);

  async function requestAccounts() {
    if (!web3) {
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const allAccounts = await web3.eth.getAccounts();
    setAccounts(allAccounts);
    setConnectedAccount(allAccounts[0]); // first account is the current one

    allAccounts.map(async (account) => {
      const balanceInWei = web3.utils.fromWei(
        await web3.eth.getBalance(account),
        "ether"
      );
      setAllBalances((prevBalances) => ({
        ...prevBalances,
        [account]: balanceInWei,
      }));
    });
  }

  const getEvents = useCallback(async () => {
    if (!contract || !connectedAccount) return;

    try {
      setIsEventLoading(true);

      const events = await contract.methods
        .getAllEvents()
        .call<IEvent[]>({ from: connectedAccount });

      setEvents(events);
      setIsEventLoading(false);
    } catch (err: unknown) {
      console.error(err);
    }
  }, [contract, connectedAccount]);

  const getUserInfo = useCallback(() => {
    if (!connectedAccount) return;

    setIsUserInfoLoading(true);
    contract?.methods
      .getUserInfo()
      .call({ from: connectedAccount })
      .then((userInfo) => {
        setUser({
          userName: userInfo.userName,
          age: Number(userInfo.age),
          userAddress: userInfo.userAddress,
        });
      })
      .catch((error) => {
        setUser(undefined);
        console.error("Error fetching user info:", error);
      })
      .finally(() => {
        setIsUserInfoLoading(false);
      });
  }, [connectedAccount, contract]);

  useEffect(() => {
    async function getAccountBalance() {
      if (!connectedAccount || !web3) return "loading...";

      const balanceInWei = await web3.eth.getBalance(connectedAccount);
      setCurrentBalance(web3.utils.fromWei(balanceInWei, "ether"));
    }

    getAccountBalance();
    getUserInfo();
    getEvents();
  }, [connectedAccount]);

  useEffect(() => {
    // if metamask is present, it will inject the ethereum object into window
    if (!window.ethereum) return;

    const web3Instance = new Web3(window.ethereum);
    setWeb3(web3Instance);
    const contract = new web3Instance.eth.Contract(
      contractABI,
      contractAddress
    );
    setContract(contract);
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3,
        requestAccounts,
        contract,
        accounts,
        user,
        refreshUserInfo: getUserInfo,
        isUserInfoLoading,
        allBalances,
        connectedAccount,
        setConnectedAccount,
        currentBalance,
        events,
        setEvents,
        refreshEvents: getEvents,
        isEventLoading,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3Context() {
  return React.useContext(Web3Context);
}
