// export async function getLeader() {
//   const response = await fetch(
//     "https://wedev-api.sky.pro/api/leaderboard",

//     {
//       method: "GET",
//     },
//   );

//   const data = await response.json();
//   return data;
// }

export async function postLeader(name, time) {
  const response = await fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      time: time,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Ошибка входа");
  } else {
    return data;
  }
}
