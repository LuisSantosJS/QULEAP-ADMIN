import React, { useEffect, useReducer, useState } from "react";
import { api } from "../../services/api";
//@ts-ignore
import { toast } from "react-nextjs-toast";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

interface MainProps {}

interface UserProps {
  id: string;
  email: string;
  planId?: string;
  password?: string;
  plan?: {
    title: string;
    description: string;
    maxSong: number;
    id: string;
  };
}

interface Plans {
  title: string;
  description: string;
  id: string;
}

export const UsersC: React.FC<MainProps> = () => {
  const [index0, setIndex0] = useState(true);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [plans, setPlans] = useState<Plans[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps>({
    id: "",
    email: "",
    plan: {
      description: "",
      id: "",
      maxSong: 0,
      title: "",
    },
    planId: "",
  });

  const deleteUser = async (userId: string) => {
    setLoading(true);
    const response = await api.delete("/user/" + userId, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
    if (response.status !== 200 && response.status !== 201) {
      let msm = "";
      for (const message of response?.data.message as string[]) {
        msm = msm + (msm.length == 0 ? "" : " | ") + message;
      }
      toast.notify(String(msm), {
        duration: 5,
        type: "error",
      });
    }
    await loadUsers();
    setLoading(false);
  };
  const onDelete = (userId: string) => {
    confirmAlert({
      title: "Ops..",
      message:
        "Quer deletar o usuário " +
        users[users.findIndex((e) => e.id == userId)].email +
        " ?",
      buttons: [
        {
          label: "Sim",
          onClick: () => deleteUser(userId),
        },
        {
          label: "Não",
          onClick: () => {},
        },
      ],
    });
  };

  const loadPlans = async () => {
    const response = await api.get("/plan/all", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
    if (response.status == 200 || response.status == 201) {
      setPlans(response.data);
    }
  };

  useEffect(() => {
    if (!!editId) {
      setUser(users[users.findIndex((e) => e.id == editId)]);
    } else {
      setUser({
        id: "",
        email: "",
        plan: {
          description: "",
          id: "",
          maxSong: 0,
          title: "",
        },
      } as UserProps);
    }
  }, [editId]);
  const loadUsers = async () => {
    const response = await api.get("/user/all", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
    if (response.status == 200 || response.status == 201) {
      setUsers(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      loadUsers();
    }
  }, [typeof window]);

  useEffect(() => {
    if (typeof window !== undefined) {
      loadPlans();
    }
  }, [typeof window]);

  const onUpdate = async () => {
    setLoading(true);

    const response = await api.patch(
      "/user/" + editId,
      {
        planId: user.planId,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      }
    );
    if (response.status == 200 || response.status == 201) {
      loadUsers();
      setEditId(null);
      setIsEdit(false);
    } else {
      let msm = "";
      for (const message of response?.data.message as string[]) {
        msm = msm + (msm.length == 0 ? "" : " | ") + message;
      }
      toast.notify(String(msm), {
        duration: 5,
        type: "error",
      });
    }
    setLoading(false);
  };

  const onCreate = async () => {
    setLoading(true);

    const response = await api.post(
      "/user",
      {
        email: user.email,
        password: user?.password,
        planId: user?.planId,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      }
    );
    if (
      (response.status == 200 || response.status == 201) &&
      !!response?.data?.id
    ) {
      loadUsers();
      setUser({
        id: "",
        email: "",
        planId: "",
      } as UserProps);
      setEditId(null);
      setIsEdit(false);
    } else {
      let msm = "";
      for (const message of response?.data?.message as string[]) {
        msm = msm + (msm.length == 0 ? "" : " | ") + message;
      }
      toast.notify(String(msm), {
        duration: 5,
        type: "error",
      });
    }
    setLoading(false);
  };

  const onChecked = (planId: string) => {
    if (user?.planId?.length == 0) return false;
    if (user?.planId == planId) return true;
    return false;
  };
  const onCheck = (planId: string) => {
    setUser({ ...user, planId: planId });
  };

  const onSubmit = () => {
    if (!!editId) return onUpdate();
    return onCreate();
  };

  return (
    <>
      {isEdit && (
        <div className="main-white-box0">
          <div style={{ paddingBottom: 20 }} className="main-box">
            <h3 style={{ paddingBottom: 20 }} className="loginName">
              {!!editId ? "Editar" : "Criar"}
            </h3>
            <span style={{ width: "70%" }}> Email</span>
            <input
              className="inputLogin"
              name="email"
              value={user?.email}
              disabled={!!editId}
              onChange={(e) => {
                setUser({ ...user, email: e.currentTarget.value } as UserProps);
              }}
              type={"text"}
              placeholder="Email"
            />
            {!editId && (
              <input
                className="inputLogin"
                name="password"
                value={user?.password}
                onChange={(e) => {
                  setUser({
                    ...user,
                    password: e.currentTarget.value,
                  } as UserProps);
                }}
                type={"password"}
                placeholder="Password"
              />
            )}
            <span style={{ width: "70%", marginBottom: 10 }}> Planos</span>
            {plans?.map((res) => (
              <div
                key={res.id}
                style={{ width: "70%" }}
                className="row-table-songs"
              >
                <div className="center">
                  <input
                    type="checkbox"
                    id={res.description}
                    name={res.description}
                    onClick={() => onCheck(res.id)}
                    checked={onChecked(res.id)}
                  />
                  <label style={{ marginLeft: 10 }} htmlFor={res.description}>
                    {res.title}{" "}
                  </label>
                </div>
              </div>
            ))}
            <div
              style={{ height: 50, width: "70%" }}
              className="row-table-songs"
            >
              <button
                disabled={loading}
                style={{ backgroundColor: "transparent", color: "black" }}
                className="buttonLogin"
                onClick={() => {
                  setEditId(null);
                  setIsEdit(false);
                }}
              >
                Cancelar
              </button>
              <button
                onClick={onSubmit}
                disabled={loading}
                className="buttonLogin"
              >
                {!!editId ? "Editar" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}
      {!isEdit && (
        <div className="main-white-box0">
          <div
            style={{ paddingBottom: 20, marginBottom: 80 }}
            className="main-box"
          >
            <h3 style={{ marginTop: 40, marginBottom: 20 }}>Usuários</h3>
            <span className="row-table-songs">
              <span className="row-table-songs">
                <h4>Nome</h4>
                <h4>Plano</h4>
              </span>
              <h4 style={{ width: 180, textAlign: "right" }}>Acões</h4>
            </span>
            {!!users &&
              users?.map((res, i) => {
                return (
                  <span className="row-table-songs" key={i}>
                    <span className="row-table-songs">
                      <span>{res.email}</span>
                      <span>{res.plan?.title}</span>
                    </span>
                    <span
                      className="row-table-songs"
                      style={{
                        width: 180,
                        flexDirection: "row-reverse",
                        justifyContent: "flex-start",
                      }}
                    >
                      <span
                        onClick={() => onDelete(res.id)}
                        className="cursor"
                        style={{ marginLeft: 10 }}
                      >
                        Excluir
                      </span>
                      <span
                        onClick={() => {
                          setEditId(res.id);
                          setIsEdit(true);
                        }}
                        className="cursor"
                        style={{ cursor: "pointer" }}
                      >
                        Editar
                      </span>
                    </span>
                  </span>
                );
              })}
          </div>
        </div>
      )}
      <span onClick={() => setIsEdit(true)} className="button-add-container">
        <img width={20} height={20} src={"/add.png"} />
      </span>

      <div
        style={{ display: loading ? "flex" : "none" }}
        className={"loader"}
      />
    </>
  );
};
