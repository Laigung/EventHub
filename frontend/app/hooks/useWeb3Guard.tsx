import { Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLayoutContext } from "~/LayoutContext";
import { useWeb3Context } from "~/Web3Context";

export default function useWeb3Guard() {
  const { connectedAccount, user } = useWeb3Context();
  const { setMenuKey } = useLayoutContext();
  const [redirectTimeout, setRedirectTimeout] = useState<number>(10000);
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
      <div className="w-full h-full text-2xl text-sol-dark flex flex-col justify-center items-center">
        {!connectedAccount && (
          <p>
            Please connect to MetaMask and register an user account to enjoy our
            platform.
          </p>
        )}
        {!user && <p>Please register an user account to enjoy our platform.</p>}
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
