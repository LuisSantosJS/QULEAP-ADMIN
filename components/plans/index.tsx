import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
//@ts-ignore
import { toast } from "react-nextjs-toast";

interface MainProps {}

interface Plans {
  title: string;
  description: string;
  maxSong: number;
  id: string;
}

export const PlansC: React.FC<MainProps> = () => {

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plans[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plans>({
    id: "",
    description: "",
    maxSong: 1,
    title: "",
  });

  const loadPlans = async () => {
    const response = await api.get("/plan/all", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
    if ((response.status == 200 || response.status == 201)) {
      setPlans(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!!editId) {
      setPlan(plans[plans.findIndex((e) => e.id == editId)]);
    } else {
      setPlan({
        id: "",
        description: "",
        maxSong: 1,
        title: "",
      } as Plans);
    }
  }, [editId]);

  useEffect(() => {
    if (typeof window !== undefined) {
      loadPlans();
    }
  }, [typeof window]);

  const onUpdate = async () => {
    setLoading(true);

    const response = await api.patch(
      "/plan/" + editId,
      {
        maxSong: plan.maxSong,
        title: plan.title,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      }
    );
    if ((response.status == 200 || response.status == 201)) {
      loadPlans();
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
      "/plan",
      {
        maxSong: plan.maxSong,
        title: plan.title,
        description: plan.title.trim().toLocaleLowerCase(),
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      }
    );
    if ((response.status == 200 || response.status == 201)  && !!response?.data?.id) {
      loadPlans();
      setPlan({
        id: "",
        maxSong: 1,
        description: "",
        title: "",
      } as Plans);
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
            <span style={{ width: "70%" }}> Nome</span>
            <input
              className="inputLogin"
              name="name"
              value={plan?.title}
              onChange={(e) => {
                setPlan({ ...plan, title: e.currentTarget.value } as Plans);
              }}
              type={"text"}
              placeholder="Nome"
            />

            <span style={{ width: "70%" }}> Limite</span>
            <input
              className="inputLogin"
              name="limite"
              value={plan?.maxSong}
              onChange={(e) => {
                setPlan({
                  ...plan,
                  maxSong: parseInt(e.currentTarget.value),
                } as Plans);
              }}
              type={"number"}
              placeholder="Limite"
            />

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
          <span style={{paddingBottom: 20}}>As playlist&apos;s dos usuários já criadas não serão alteras com o novo limite adicionado</span>
        </div>
      )}
      {!isEdit && (
        <div className="main-white-box0">
          <div
            style={{ paddingBottom: 20, marginBottom: 80 }}
            className="main-box"
          >
            <h3 style={{ marginTop: 40, marginBottom: 20 }}>Planos</h3>
            <span className="row-table-songs">
              <span className="row-table-songs">
                <h4>Nome</h4>
                <h4>Limite</h4>
              </span>
              <h4 style={{ width: 180, textAlign: "right" }}>Acões</h4>
            </span>
            {!!plans &&
              plans?.map((res, i) => {
                return (
                  <span className="row-table-songs" key={i}>
                    <span className="row-table-songs">
                      <span>{res.title}</span>
                      <span>{res.maxSong}</span>
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
