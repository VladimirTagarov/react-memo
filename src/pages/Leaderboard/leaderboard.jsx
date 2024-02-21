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

  // useEffect(() => {
  //   getLeader().then(leader => {
  //     console.log(leader);
  //     setLeaders(leader);
  //     arrayOfLeaders = leader;
  //   });
  // }, [getLeader]);
  const { data = [] } = useGetLeadersQuery();
  console.log("data: " + data);
  // const [addLeader] = useAddLeadersMutation();
  console.log("arrayofleaders: ", arrayOfLeaders);

  function newGame() {
    navigate("/", { replace: true });
  }
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
      {/* {isLoading ? (
        <h1>Загрузка...</h1>
      ) : (
        data &&
        data?.map(item => {
          return (
            <div key={item.id} className={styles.row}>
              {item.name}
            </div>
          );
        })
      )} */}
    </div>
  );
}
