import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useSelector } from "react-redux";
import achiveAlohomoraImageUrl from "../Card/images/achiveAlohomora.png";
import achiveEpiphanyImageUrl from "../Card/images/achiveEpiphany.png";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";
const STATUS_PAUSE = "STATUS_PAUSE";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const [isEpiphanyClicked, setIsEpiphanyClicked] = useState(false);

  const [isAlohomoraClicked, setIsAlohomoraClicked] = useState(false);

  const isChecked = useSelector(state => state.cards.isChecked);
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  let [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);
  // Количество ошибок
  const [countOfMistakes, setCountOfMistakes] = useState(3);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  let [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  const imgAlt = "achive emodji";

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setCountOfMistakes(3);
    setIsEpiphanyClicked(false);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */

  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });
    console.log("nextCards: ", nextCards);

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    let openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);
      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    if (isChecked) {
      console.log(openCardsWithoutPair);
      const closingOfCards = () => {
        openCardsWithoutPair = openCardsWithoutPair.map(card => {
          card.open = false;
        });
      };
      if (openCardsWithoutPair.length >= 2) {
        // setCountOfMistakes(countOfMistakes + 1);
        setTimeout(closingOfCards, 1000);
      }
      if (openCardsWithoutPair.length === 2) {
        setCountOfMistakes(countOfMistakes - 1);
      }

      const playerLost = openCardsWithoutPair.length >= 2 && countOfMistakes === 0;
      if (playerLost) {
        finishGame(STATUS_LOST);
        setCountOfMistakes(0);
        return;
      }

      // ... игра продолжается
    } else {
      const playerLost = openCardsWithoutPair.length >= 2;

      // "Игрок проиграл", т.к на поле есть две открытые карты без пары
      if (playerLost) {
        finishGame(STATUS_LOST);
        setCountOfMistakes(0);
        return;
      }

      // handleEpiphany(clickedCard);
      // ... игра продолжается
    }
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    if (status !== STATUS_PAUSE) {
      const intervalId = setInterval(() => {
        setTimer(getTimerValue(gameStartDate, gameEndDate));
      }, 300);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [gameStartDate, gameEndDate, STATUS_LOST, status]);

  const handleEpiphany = () => {
    setIsEpiphanyClicked(true);
    setStatus(STATUS_PAUSE);
    let newTime = timer;
    console.log(timer);
    console.log(gameStartDate);
    // setStatus(STATUS_PREVIEW);
    let cardsWhenEpiphany = [];
    cardsWhenEpiphany = cards.map(card => {
      if (card.open === false) {
        return { ...card, open: true, openBefore: false };
      } else {
        return card;
      }
    });

    setCards(cardsWhenEpiphany);
    console.log(cardsWhenEpiphany);
    setTimeout(() => {
      let newCards = cardsWhenEpiphany.map(card => {
        if (card.openBefore === false) {
          return { ...card, open: false };
        }
        return card;
      });
      setCards(newCards);
      setTimer(newTime);
      // gameEndDate = gameEndDate - 5000;
      setStatus(STATUS_IN_PROGRESS);
    }, 5000);
  };

  const handleAlohomora = () => {
    setIsAlohomoraClicked(true);
    // Закрытые карты на игровом поле
    const closedCards = cards.filter(card => !card.open);

    const randomIndexOfCard = Math.floor(Math.random() * (closedCards.length - 1));
    const randomCard = closedCards[randomIndexOfCard];
    // randomCard.open = true;
    let coupleOfRandomCard = cards.filter(card => card.suit === randomCard.suit && card.rank === randomCard.rank);
    console.log("случайная карта: ", randomCard);
    console.log("случайная пара карт: ", coupleOfRandomCard);
    coupleOfRandomCard = coupleOfRandomCard.map(card => (card.open = true));
  };

  return (
    <div className={styles.container}>
      {isChecked ? (
        <div className={styles.modal}>
          <h1 className={styles.mistake}>Осталось {countOfMistakes} ошибки</h1>
          {/* <p>{countOfMistakes}</p> */}
        </div>
      ) : null}
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>

        {status === STATUS_IN_PROGRESS || status === STATUS_PAUSE ? (
          <>
            <div className={styles.achivementContainer}>
              {!isAlohomoraClicked ? (
                <>
                  <div
                    onClick={() => {
                      handleAlohomora();
                    }}
                  >
                    <img className={styles.image} src={achiveAlohomoraImageUrl} alt={imgAlt} />
                  </div>
                </>
              ) : null}{" "}
              {!isEpiphanyClicked ? (
                <>
                  <div
                    onClick={() => {
                      handleEpiphany();
                    }}
                  >
                    <img className={styles.image} src={achiveEpiphanyImageUrl} alt={imgAlt} />
                  </div>
                </>
              ) : null}
            </div>
            <Button onClick={resetGame}>Начать заново</Button>
          </>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
            isEpiphanyClicked={isEpiphanyClicked}
            setIsEpiphanyClicked={setIsEpiphanyClicked}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
            isEpiphanyClicked={isEpiphanyClicked}
          />
        </div>
      ) : null}
    </div>
  );
}
