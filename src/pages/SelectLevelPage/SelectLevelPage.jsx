import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { toggleCheck } from "../../store/cardSlice";

export function SelectLevelPage() {
  const isChecked = useSelector(state => state.cards.isChecked);
  const dispatch = useDispatch();

  const toggleChecked = () => {
    dispatch(toggleCheck());
    console.log("click");
    console.log(isChecked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <div className={styles.checkbox}>
          <input className={styles.checkbox_input} type="checkbox" onChange={toggleChecked}></input>
          <div className={styles.checkbox_text}>Легкий режим (3 жизни)</div>
        </div>
        <Link className={styles.leaderboardLink} to="/game/leaderboard">
          Перейти к лидерборду
        </Link>
      </div>
    </div>
  );
}
