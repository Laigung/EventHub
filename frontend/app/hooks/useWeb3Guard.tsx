import { Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLayoutContext } from "~/LayoutContext";
import { useWeb3Context } from "~/Web3Context";

export default function useWeb3Guard() {
  const { connectedAccount, user } = useWeb3Context();
  const { setMenuKey } = useLayoutContext();
  const [redirectTimeout, setRedirectTimeout] = useState<number>(20000);
  const navigate = useNavigate();

  useEffect(() => {
    if (!connectedAccount || !user) {
      const timeoutId = setTimeout(() => {
        setMenuKey("homeLink");
        navigate("/");
      }, redirectTimeout);

      const intervalId = setInterval(() => {
        setRedirectTimeout((prev) => {
          if (prev <= 1000) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }
  }, [connectedAccount, redirectTimeout]);

  return {
    willRedirect: connectedAccount === undefined || user === undefined,
    redirectNotice: (
      <div className="w-full h-full text-2xl text-black flex flex-col justify-center items-center">
        <p>Please complete the following(s) to enjoy our platform</p>
        <ol className="list-decimal list-inside text-sol-dark border-[1px] border-solid border-black p-2 my-2">
          {!connectedAccount && <li>connect to MetaMask</li>}
          {!user && <li>register an EventHub user account</li>}
        </ol>

        <p>{`You will be redirected to home page in ${redirectTimeout / 1000} second(s)`}</p>
        <Button
          onClick={() => {
            setMenuKey("homeLink");
            navigate("/");
          }}
          className="mt-3"
        >
          Redirect Now
        </Button>
      </div>
    ),
  };
}
