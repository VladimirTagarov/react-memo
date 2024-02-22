import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link, useParams } from "react-router-dom";
import { useAddLeadersMutation, useGetLeadersQuery } from "../../store";
import { useEffect, useState } from "react";
import { postLeader } from "../../api";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const params = useParams();
  const [newLeader, setNewLeader] = useState("");

  const [addLeader] = useAddLeadersMutation();

  const { data = [] } = useGetLeadersQuery();

  useEffect(() => console.log(data), []);
  useEffect(() => console.log(addLeader), []);

  const newTimeOfLeader = Number(gameDurationMinutes * 60 + gameDurationSeconds);
  // console.log(newTimeOfLeader);

  // async function handleNewLeader() {
  //   if (newLeader) {
  //     await addLeader({ name: newLeader, time: newTimeOfLeader });
  //     setNewLeader(newLeader);
  //   }
  // }

  async function handleNewLeader() {
    if (newLeader) {
      await postLeader(newLeader, newTimeOfLeader);
      setNewLeader(newLeader);
    }
  }

  const title =
    isWon && params.pairsCount === "3"
      ? "Вы попали на Лидерборд!"
      : isWon && params.pairsCount !== "3"
      ? "Вы победили!"
      : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return (
    <div className={title === "Вы попали на Лидерборд!" ? styles.modal2 : styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {title === "Вы попали на Лидерборд!" ? (
        <>
          <input
            className={styles.input}
            type="text"
            placeholder="Пользователь"
            value={newLeader}
            onChange={e => setNewLeader(e.target.value)}
          />
          <Button
            onClick={() => {
              handleNewLeader();
              window.location.reload(true);
            }}
          >
            Записать
          </Button>
        </>
      ) : null}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={onClick}>Начать сначала</Button>

      {title === "Вы попали на Лидерборд!" ? (
        <Link className={styles.leaderboardLink} to="/game/leaderboard">
          {" "}
          Перейти к лидерборду
        </Link>
      ) : null}
    </div>
  );
}
