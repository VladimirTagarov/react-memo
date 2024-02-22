import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./leaderboard.module.css";
// import { getLeader } from "../../api";
// import { useState } from "react";
import { useGetLeadersQuery } from "../../store/leaderApi";
// import { useEffect } from "react";

export function Leaderboard() {
  const navigate = useNavigate();
  // const [arrayOfLeaders, setArrayOfLeaders] = useState([]);

  const { data = [], isLoading } = useGetLeadersQuery();

  // console.log("data: " + data.leaders[0].name);
  // const [addLeader] = useAddLeadersMutation();
  let leaderArray = data.leaders;
  // leaderArray?.sort((a, b) => a.time - b.time);
  // console.log(leaderArray);

  let sortirizedArray = leaderArray.sort(function (a, b) {
    if (a.release_date > b.release_date) {
      return 1;
    }
    if (a.release_date < b.release_date) {
      return -1;
    }
    return 0;
  });
  console.log(sortirizedArray);

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
        <div className={classname}>Время</div>
      </div>
      {isLoading ? (
        <h1>Загрузка...</h1>
      ) : (
        data &&
        leaderArray.map(item => {
          return (
            <div className={styles.row}>
              <div key={item.id} className={styles.textInShape}>
                # {item.id}
              </div>
              <div key={item.id * 15} className={styles.textInShape}>
                {item.name}
              </div>
              <div key={item.id * 27} className={styles.textInShape}>
                {timeConverter(item.time)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
