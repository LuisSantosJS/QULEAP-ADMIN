import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
//@ts-ignore
import { ToastContainer, toast } from "react-nextjs-toast";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname, asPath, push, query, replace } = useRouter();
  useEffect(() => {
    if (
      pathname.search("/login") < 0 &&
      typeof window != undefined &&
      !!asPath &&
      !!pathname
    ) {
      const value = localStorage.getItem("@token");
      if (!value) {
        replace("/login");
      }
    }
  
  }, [typeof window, query, asPath]);

  return (
    <>
      <Component {...pageProps} /> <ToastContainer />
    </>
  );
}

export default MyApp;
