import { CopyOutlined } from "@ant-design/icons";
import { notification, Select, SelectProps } from "antd";

interface AccountInformationProps {
  accountOptions: SelectProps["options"];
  connectedAccount: string;
  setConnectedAccount: (
    value: React.SetStateAction<string | undefined>
  ) => void;
  currentBalance: string;
}

export default function MetaMaskAccountInformation({
  accountOptions,
  connectedAccount,
  setConnectedAccount,
  currentBalance,
}: AccountInformationProps) {
  const [api, contextHolder] = notification.useNotification();

  return (
    <div className="w-full flex flex-col justify-start items-start text-xl">
      {contextHolder}
      <div className="text-2xl font-bold text-sol-dark">
        MetaMask Account Information
      </div>
      <div className="w-full flex justify-start items-center gap-2">
        <span>Current account: </span>
        <Select
          className="min-w-[500px]"
          options={accountOptions}
          defaultValue={connectedAccount}
          onChange={(val: string) => setConnectedAccount(val)}
        />
        <CopyOutlined
          onClick={() => {
            navigator.clipboard.writeText(connectedAccount);
            api.success({
              message: "Address copied to clipboard",
              duration: 2,
            });
          }}
        />
      </div>
      <div>
        <span>Balance</span>: {currentBalance} ether
      </div>
    </div>
  );
}
