function getCurrentDateTime() {
  const currentDate = new Date();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  let hours = currentDate.getHours() + 1;
  const amOrPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");

  const currentDateTime = `${month} ${day}, ${year}, ${hours}:${minutes} ${amOrPm}`;
  return currentDateTime;
}

module.exports = { getCurrentDateTime };
