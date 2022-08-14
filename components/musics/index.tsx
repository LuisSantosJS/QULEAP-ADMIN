import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
//@ts-ignore
import { toast } from "react-nextjs-toast";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

interface MainProps {}

interface SongsProps {
  id: string;
  name: string;
  SongPlanMap: {
    plan: {
      title: string;
      id: string;
      description: string;
    };
  }[];
}

interface Plans {
  title: string;
  description: string;
  id: string;
}

export const Musics: React.FC<MainProps> = () => {
  const [index0, setIndex0] = useState(true);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<SongsProps[]>([]);
  const [plans, setPlans] = useState<Plans[]>([]);
  const [mySongs, setMySongs] = useState<SongsProps[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [song, setSong] = useState<SongsProps>({
    id: '',
    name:'',
    SongPlanMap:[
    ]
  });

  const deleteMusic = async (musicId: string) => {
    setLoading(true);
    const response = await api.delete("/song/" + musicId, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
    if ((response.status !== 200 && response.status !== 201)) {
      let msm = "";
      for (const message of response?.data.message as string[]) {
        msm = msm + (msm.length == 0 ? "" : " | ") + message;
      }
      toast.notify(String(msm), {
        duration: 5,
        type: "error",
      });
    }
    await loadMusics();
    setLoading(false);
  };
  const onDelete = (musicId: string) => {
    confirmAlert({
      title: "Ops..",
      message:
        "Quer deletar a música " +
        songs[songs.findIndex((e) => e.id == musicId)].name +
        " ?",
      buttons: [
        {
          label: "Sim",
          onClick: () => deleteMusic(musicId),
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
    if ((response.status == 200 || response.status == 201)) {
      setPlans(response.data);
    }
  };

  useEffect(() => {
    if (!!editId) {
      setSong(songs[songs.findIndex((e) => e.id == editId)]);
    } else {
      setSong({
        id:'',
        name:'',SongPlanMap:[]
      } as SongsProps);
    }
  }, [editId]);
  const loadMusics = async () => {
    const response = await api.get("/song/all-musics", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
    if ((response.status == 200 || response.status == 201)) {
      setSongs(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      loadMusics();
    }
  }, [typeof window]);

  useEffect(() => {
    if (typeof window !== undefined) {
      loadPlans();
    }
  }, [typeof window]);

  const onUpdate = async () => {
    setLoading(true);
    const plns = song?.SongPlanMap.map((res) => {
      return res.plan.description;
    });
    const response = await api.patch(
      "/song/" + editId,
      {
        plans: plns,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      }
    );
    if ((response.status == 200 || response.status == 201)) {
      loadMusics();
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
    const plns = song?.SongPlanMap.map((res) => {
      return res.plan.description;
    });
    const response = await api.post(
      "/song",
      {
        plans: plns,
        name: song?.name,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      }
    );
    if ((response.status == 200 || response.status == 201) && !!response?.data?.id) {
      loadMusics();
      setSong({
        id:'',
        name:'',SongPlanMap:[]
      } as SongsProps);
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

  const onChecked = (planId: string) => {
    if (!!song?.SongPlanMap?.find((e) => e.plan.id == planId)) return true;
    return false;
  };
  const onCheck = (planId: string) => {
    if (!!song?.SongPlanMap?.find((e) => e.plan.id == planId)) {
      setSong({
        ...song,
        SongPlanMap: song.SongPlanMap?.filter((e) => e.plan.id !== planId),
      } as SongsProps);
    } else {
      setSong({
        ...song,
        SongPlanMap: [
          ...(song?.SongPlanMap as SongsProps["SongPlanMap"]),
          {
            plan: plans[plans.findIndex((e) => e.id == planId)],
          },
        ],
      } as SongsProps);
    }
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
              value={song?.name}
              disabled={!!editId}
              onChange={(e) => {
                setSong({ ...song, name: e.currentTarget.value } as SongsProps);
              }}
              type={"text"}
              placeholder="Nome"
            />
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
          <div style={{ paddingBottom: 20, marginBottom: 80 }} className="main-box">
            <h3 style={{ marginTop: 40, marginBottom: 20 }}>Músicas</h3>
            <span className="row-table-songs">
              <span className="row-table-songs">
                <h4>Nome</h4>
                <h4>Planos</h4>
              </span>
              <h4 style={{ width: 180, textAlign: "right" }}>Acões</h4>
            </span>
            {!!songs &&
              songs?.map((res, i) => {
                return (
                  <span className="row-table-songs" key={i}>
                    <span className="row-table-songs">
                      <span>{res.name}</span>
                      <span>
                        {res.SongPlanMap.map((r) => (
                          <span key={r.plan.description}>
                            {r.plan.title} |{" "}
                          </span>
                        ))}
                      </span>
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
      <span onClick={()=> setIsEdit(true)} className="button-add-container">
        <img width={20} height={20} src={"/add.png"} />
      </span>

      <div
        style={{ display: loading ? "flex" : "none" }}
        className={"loader"}
      />
    </>
  );
};
