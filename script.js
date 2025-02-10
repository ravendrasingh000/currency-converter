import { countryList } from "./countryName.js";

const BASE_URL = "https://v6.exchangerate-api.com/v6/ac7a10d2555615ca9c0196dd/latest/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const amount = document.querySelector(".amount input");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Dropdowns ke andar country list add karna
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Flag update function
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Exchange Rate Fetch Karna
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = amtVal;
  }

  let URL = `${BASE_URL}${fromCurr.value}`;
  try {
    let response = await fetch(URL);
    let data = await response.json();

    if (data.conversion_rates && data.conversion_rates[toCurr.value]) {
      let rate = data.conversion_rates[toCurr.value];
      let finalAmount = (amtVal * rate).toFixed(2);
      msg.innerHTML = `<span>${amtVal}</span> ${fromCurr.value}  =  <span>${finalAmount}</span> ${toCurr.value}`;
      msg.classList.add("massage");
    } else {
      msg.innerText = "Error fetching exchange rate.";
    }
  } catch (error) {
    msg.innerText = "Failed to fetch data. Check API key.";
  }
});
