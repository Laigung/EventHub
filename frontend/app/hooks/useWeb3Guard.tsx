import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLayoutContext } from "~/LayoutContext";
import { useWeb3Context } from "~/Web3Context";

export default function useWeb3Guard() {
  const { connectedAccount, user } = useWeb3Context();
  const { setMenuKey } = useLayoutContext();
  const [redirectTimeout, setRedirectTimeout] = useState<number>(5000);
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
    willRedirect: connectedAccount !== undefined,
    redirectNotice: (
      <div className="text-2xl text-sol-dark">
        <p>
          Please connect to MetaMask and register an user account to enjoy our
          platform.
        </p>
        <p>{`You will be redirected to home page in ${redirectTimeout / 1000} second(s)`}</p>
      </div>
    ),
  };
}
