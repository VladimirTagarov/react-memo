import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./leaderboard.module.css";
// import { getLeader } from "../../api";
// import { useState } from "react";
import { useGetLeadersQuery } from "../../store/leaderApi";

export function Leaderboard() {
  const navigate = useNavigate();
  // const [leaders, setLeaders] = useState([]);
  let arrayOfLeaders = [];

  const { data = [], isLoading } = useGetLeadersQuery();
  // console.log("data: " + data.leaders[0].name);
  // const [addLeader] = useAddLeadersMutation();
  console.log("arrayofleaders: ", arrayOfLeaders);

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
        data.leaders.map(item => {
          return (
            <div className={styles.row}>
              <div key={item.id} className={styles.textInShape}>
                # {item.id}
              </div>
              <div key={item.id * 5} className={styles.textInShape}>
                {item.name}
              </div>
              <div key={item.id * 7} className={styles.textInShape}>
                {timeConverter(item.time)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
