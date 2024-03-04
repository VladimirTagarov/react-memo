import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./leaderboard.module.css";
// import { getLeader } from "../../api";
// import { useState } from "react";
import { useGetLeadersQuery } from "../../store/leaderApi";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
import difficult from "./difficult.png";
import easy from "./easy.png";
import withachieve from "./withachieve.png";
import withoutachieve from "./withoutachieve.png";
import { useState } from "react";

export function Leaderboard() {
  // const isAlohomoraClicked = useSelector(state => state.cards.isAlohomoraClicked);
  // const isEpiphanyClicked = useSelector(state => state.cards.isEpiphanyClicked);
  // const isChecked = useSelector(state => state.cards.isChecked);
  const [isAlohomoraTooltip, setIsAlohomoraTooltip] = useState(false);
  const [isDifmodeTooltip, setIsDifmodeTooltip] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const navigate = useNavigate();
  // const [arrayOfLeaders, setArrayOfLeaders] = useState([]);

  const { data = [{}], isLoading } = useGetLeadersQuery();

  const imgAlt = "picture";

  // console.log("data: " + data.leaders[0].name);
  // const [addLeader] = useAddLeadersMutation();
  let leaderArray = [{}];
  leaderArray = data.leaders;
  // console.log("последний эл-т массива: " + data.leaders[0].name);

  if (!isLoading) {
    leaderArray = [...leaderArray].sort((a, b) => a.time - b.time);
  }

  const openTooltip = e => {
    setIsAlohomoraTooltip(true);
    setSelectedLeader(e);
    console.log(e);
    console.log(selectedLeader);
  };

  const closeTooltip = index => {
    setIsAlohomoraTooltip(false);
  };

  const openTooltipDif = e => {
    setIsDifmodeTooltip(true);
    setSelectedLeader(e);
    console.log(e);
    console.log(selectedLeader);
  };

  const closeTooltipDif = index => {
    setIsDifmodeTooltip(false);
  };

  // console.log(leaderArray);

  // let sortirizedArray = [...leaderArray].sort(function (a, b) {
  //   if (a.release_date > b.release_date) {
  //     return 1;
  //   }
  //   if (a.release_date < b.release_date) {
  //     return -1;
  //   }
  //   return 0;
  // });
  // console.log(sortirizedArray);

  function newGame() {
    navigate("/", { replace: true });
  }

  function timeConverter(num) {
    const minutes = Math.floor(Number(num) / 60);
    const seconds = Math.floor(Number(num) % 60);
    return String(minutes + ":" + seconds);
  }

  const classname = styles.textInShape + " " + styles.opacityclass;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.heading}>Лидерборд</p>
        <Button
          onClick={() => {
            newGame();
          }}
        >
          Начать игру
        </Button>
      </div>
      <div className={styles.row}>
        <div className={classname}>Позиция</div>
        <div className={classname}>Пользователь</div>
        <div className={classname}>Достижения</div>
        <div className={classname}>Время</div>
      </div>
      {isLoading ? (
        <h1>Загрузка...</h1>
      ) : (
        data &&
        leaderArray?.map((item, index) => {
          return (
            <div className={styles.row} key={item.id}>
              <div className={styles.textInShape}># {item.id}</div>
              <div className={styles.textInShape}>{item.name}</div>
              <div className={styles.textInShape}>
                {item.achievements.includes(1) ? (
                  <img className={styles.image} src={easy} alt={imgAlt} onMouseEnter={() => console.log("ку-ку")} />
                ) : (
                  <>
                    <img
                      className={styles.image}
                      src={difficult}
                      alt={imgAlt}
                      onMouseEnter={e => {
                        openTooltipDif(e);
                        // console.log(index);
                      }}
                      onMouseLeave={e => closeTooltipDif(e)}
                    />{" "}
                    {isDifmodeTooltip ? (
                      <div className={styles.tooltip}>
                        <p className={styles.tooltipText}>
                          Игра пройдена <br></br>без супер-сил
                        </p>
                      </div>
                    ) : null}
                  </>
                )}

                {item.achievements.includes(2) ? (
                  <img className={styles.image} src={withachieve} alt={imgAlt} />
                ) : (
                  <>
                    <img
                      className={styles.image}
                      src={withoutachieve}
                      alt={imgAlt}
                      onMouseEnter={e => {
                        openTooltip(e);
                        // console.log(index);
                      }}
                      onMouseLeave={e => closeTooltip(e)}
                    />
                    {isAlohomoraTooltip ? (
                      <div className={styles.tooltip}>
                        <p className={styles.tooltipText}>
                          Игра пройдена <br></br>без супер-сил
                        </p>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
              <div key={item.id * 43} className={styles.textInShape}>
                {timeConverter(item.time)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
