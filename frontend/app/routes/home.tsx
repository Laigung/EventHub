import { Button, notification, Skeleton } from "antd";
import type { Route } from "./+types/home";
import { useEffect, useMemo, useState } from "react";
import MetaMaskAccountInformation from "~/components/MetaMaskAccountInformation";
import EventList from "~/components/EventList";
import { useWeb3Context } from "~/Web3Context";
import EventHubUserInformation from "~/components/EventHubUserInformation";

export function meta({}: Route.MetaArgs) {
  return [{ title: "EventHub" }];
}

function App() {
  const {
    web3,
    requestAccounts,
    accounts,
    allBalances,
    connectedAccount,
    setConnectedAccount,
    currentBalance,
    events,
    refreshEvents,
    isEventLoading,
  } = useWeb3Context();

  const [api, contextHolder] = notification.useNotification();

  const accountOptions = useMemo(() => {
    return accounts?.map((account) => ({
      label: `${account} (${allBalances[account] ?? "loading..."} ether)`,
      value: account,
    }));
  }, [accounts, allBalances]);

  const refreshEventList = async () => {
    await refreshEvents();
    api.success({
      message: "Success",
      description: "Refreshed event list successfully",
      showProgress: true,
      duration: 2,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-5 justify-center items-start">
      {contextHolder}

      {web3 === undefined ? (
        <div>Please install MetaMask to enjoy our platform.</div>
      ) : (
        <></>
      )}

      {accounts.length === 0 && (
        <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
          <h2 className="text-xl">
            Please connect your MetaMask to enjoy our platform
          </h2>
          <Button
            type="primary"
            onClick={() => requestAccounts()}
            id="requestAccounts"
            disabled={web3 === undefined}
          >
            Request MetaMask Accounts
          </Button>
        </div>
      )}
      {accounts.length > 0 && connectedAccount && (
        <>
          <div className="w-full flex gap-5 justify-between items-start">
            <div className="flex-grow-[7]">
              <MetaMaskAccountInformation
                accountOptions={accountOptions}
                connectedAccount={connectedAccount}
                currentBalance={currentBalance}
                setConnectedAccount={setConnectedAccount}
              />
            </div>
            <div className="flex-grow-[3]">
              <EventHubUserInformation />
            </div>
          </div>
          <Skeleton loading={isEventLoading}>
            <EventList
              events={events ?? []}
              isHome={true}
              refresh={refreshEventList}
            />
          </Skeleton>
        </>
      )}
    </div>
  );
}

export default App;
