import React from "react";
import { createContext, useEffect, useState } from "react";
import { Contract, Web3 } from "web3";
import { contractABI, contractAddress } from "./contract";
import { IEvent, IUser } from "./types";

type Web3ContextType = {
  web3?: Web3;
  requestAccounts: () => Promise<void>;
  contract?: Contract<typeof contractABI>;
  accounts: string[];
  user?: IUser;
  allBalances: Record<string, string>;
  connectedAccount?: string;
  setConnectedAccount: (
    value: React.SetStateAction<string | undefined>
  ) => void;
  currentBalance: string;
  events: IEvent[];
  setEvents: (value: React.SetStateAction<IEvent[]>) => void;
};

// Default context value
const defaultWeb3Context: Web3ContextType = {
  requestAccounts: async () => {},
  accounts: [],
  allBalances: {},
  connectedAccount: undefined,
  setConnectedAccount: () => {},
  currentBalance: "loading...",
  events: [],
  setEvents: () => {},
};

const Web3Context = createContext<Web3ContextType>(defaultWeb3Context);

export default function Web3ContextProvider({
  children,
}: React.PropsWithChildren) {
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract<typeof contractABI>>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [user, setUser] = useState<IUser>();

  const [allBalances, setAllBalances] = useState<Record<string, string>>({});
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [currentBalance, setCurrentBalance] = useState<string>("loading...");

  const [events, setEvents] = useState<IEvent[]>([]);

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

  useEffect(() => {
    async function getAccountBalance() {
      if (!connectedAccount || !web3) return "loading...";

      const balanceInWei = await web3.eth.getBalance(connectedAccount);
      setCurrentBalance(web3.utils.fromWei(balanceInWei, "ether"));
    }

    const getUserInfo = () => {
      if (!connectedAccount) return;

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
          console.error("Error fetching user info:", error);
        });
    };

    getAccountBalance();
    getUserInfo();
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
        allBalances,
        connectedAccount,
        setConnectedAccount,
        currentBalance,
        events,
        setEvents,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3Context() {
  return React.useContext(Web3Context);
}
