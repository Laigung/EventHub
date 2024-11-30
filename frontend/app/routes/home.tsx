import { Button } from 'antd';
import type { Route } from './+types/home';
import { useEffect, useMemo, useState } from 'react';
import { Web3 } from 'web3';
import AccountInformation from '~/components/AccountInformation';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Event Ticket Platform' }];
}

function App() {
  const [web3, setWeb3] = useState<Web3>();
  const [warning, setWarning] = useState<string>();
  const [accountButtonDisabled, setAccountButtonDisabled] =
    useState<boolean>(false);
  const [accounts, setAccounts] = useState<string[]>();
  const [allBalances, setAllBalances] = useState<Record<string, string>>({});

  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [currentBalance, setCurrentBalance] = useState<string>('loading...');

  const accountOptions = useMemo(() => {
    return accounts?.map((account) => ({
      label: `${account} (${allBalances[account] ?? 'loading...'} ether)`,
      value: account,
    }));
  }, [accounts, allBalances]);

  async function requestAccounts() {
    if (!web3) {
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const allAccounts = await web3.eth.getAccounts();
    setAccounts(allAccounts);
    setConnectedAccount(allAccounts[0]); // first account is the current one

    allAccounts.map(async (account) => {
      const balanceInWei = web3.utils.fromWei(
        await web3.eth.getBalance(account),
        'ether'
      );
      setAllBalances((prevBalances) => ({
        ...prevBalances,
        [account]: balanceInWei,
      }));
    });
  }

  useEffect(() => {
    async function getAccountBalance() {
      if (!connectedAccount || !web3) return 'loading...';

      const balanceInWei = await web3.eth.getBalance(connectedAccount);
      setCurrentBalance(web3.utils.fromWei(balanceInWei, 'ether'));
    }

    connectedAccount && localStorage.setItem('account', connectedAccount);
    getAccountBalance();
  }, [connectedAccount]);

  useEffect(() => {
    // if metamask is present, it will inject the ethereum object into window
    if (window.ethereum) {
      setWeb3(new Web3(window.ethereum));
    } else {
      // no Ethereum provider - instruct user to install MetaMask
      setWarning('Please install MetaMask');
      setAccountButtonDisabled(true);
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-5 justify-center items-start">
      {warning ?? <div>{warning}</div>}

      {!accounts && (
        <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
          <h2 className="text-xl">
            Please connect your MetaMask to enjoy our platform
          </h2>
          <Button
            type="primary"
            onClick={() => requestAccounts()}
            id="requestAccounts"
            disabled={accountButtonDisabled}
          >
            Request MetaMask Accounts
          </Button>
        </div>
      )}
      {accounts && connectedAccount && (
        <AccountInformation
          accountOptions={accountOptions}
          connectedAccount={connectedAccount}
          currentBalance={currentBalance}
          setConnectedAccount={setConnectedAccount}
        />
      )}
    </div>
  );
}

export default App;
