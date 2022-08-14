import React, { useState } from "react";
import { api } from "../../services/api";
//@ts-ignore
import { toast } from "react-nextjs-toast";
import Router from "next/router";

export const LoginComponent = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    if (!!response?.data?.token) {
      localStorage.setItem("@token", response?.data?.token);
      Router.push("/");
    } else {
      let msm = "";
      for (const message of response?.data.message as string[]) {
        msm = msm + (msm.length == 0 ? "" : " | ") + message;
      }
      toast.notify(String(msm), {
        duration: 5,
        type: "error",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <div className="main-white-box">
        <h3 className="loginName">LOGIN</h3>

        <input
          className="inputLogin"
          name="mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
          placeholder="Email"
        />

        <input
          className="inputLogin"
          name="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={"password"}
          placeholder="Senha"
        />

        <button onClick={onSubmit} disabled={loading} className="buttonLogin">
          Login
        </button>
      </div>
      <div style={{display: loading? 'flex': 'none'}} className={"loader"} />
    </>
  );
};
