import { Button, notification, Skeleton } from 'antd';
import type { Route } from './+types/home';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AccountInformation from '~/components/AccountInformation';
import EventList from '~/components/EventList';
import { useWeb3Context } from '~/Web3Context';
import { IEvent } from '~/types';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Event Ticket Platform' }];
}

function App() {
  const {
    web3,
    contract,
    requestAccounts,
    accounts,
    allBalances,
    connectedAccount,
    setConnectedAccount,
    currentBalance,
    events,
    setEvents,
  } = useWeb3Context();

  const [api, contextHolder] = notification.useNotification();

  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);

  const accountOptions = useMemo(() => {
    return accounts?.map((account) => ({
      label: `${account} (${allBalances[account] ?? 'loading...'} ether)`,
      value: account,
    }));
  }, [accounts, allBalances]);

  const getEvents = useCallback(async () => {
    if (!contract || !connectedAccount) return;

    try {
      setIsLoadingEvents(true);

      const events = await contract.methods
        .getAllEvents()
        .call<IEvent[]>({ from: connectedAccount });

      setEvents(events);
      setIsLoadingEvents(false);
    } catch (err: unknown) {
      api.error({
        message: 'Failed to fetch events',
        description: JSON.stringify(err),
        duration: 2,
      });
    }
  }, [contract, connectedAccount]);

  const refreshEventList = async () => {
    await getEvents();
    api.success({
      message: "Success",
      description: 'Refresh event list successfully',
      duration: 2,
    });
  };

  useEffect(() => {
    getEvents();
  }, [contract, connectedAccount]);

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
          <AccountInformation
            accountOptions={accountOptions}
            connectedAccount={connectedAccount}
            currentBalance={currentBalance}
            setConnectedAccount={setConnectedAccount}
          />
          <Skeleton loading={isLoadingEvents}>
            <EventList events={events ?? []} refresh={refreshEventList} />
          </Skeleton>
        </>
      )}
    </div>
  );
}

export default App;
