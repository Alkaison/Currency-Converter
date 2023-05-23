import { currency_list, api } from "./currencyCodes.js";

const fromCurrencySelectTag = document.getElementById("fromCurrency");
const toCurrencySelectTag = document.getElementById("toCurrency");
const resultTag = document.getElementById("result");
const btn = document.getElementById("btn");
const status = document.getElementById("status");

currency_list.forEach((code) => {
    const newElement = document.createElement("option");
    newElement.value = code;
    newElement.textContent = code;

    if(code == "USD")
        newElement.selected = "true";
    
    fromCurrencySelectTag.append(newElement);
});

currency_list.forEach((code) => {
    const newElement = document.createElement("option");
    newElement.value = code;
    newElement.textContent = code;

    if(code == "INR")
        newElement.selected = "true";
    
    toCurrencySelectTag.append(newElement);
});

document.getElementById("switchCurrency").onclick = () => {

    const fromValue = fromCurrencySelectTag.value;
    fromCurrencySelectTag.value = toCurrencySelectTag.value;
    toCurrencySelectTag.value = fromValue;

};

btn.onclick = () => {

    const numberInputField = document.getElementById("userValue");
    const userEnteredAmount = numberInputField.value;

    if(userEnteredAmount < 1 || isNaN(userEnteredAmount)) {
        numberInputField.style.border = "1px solid red";
        resultTag.style.color = "red";
        resultTag.textContent = "Error: Only numeric values greater than 0 are allowed.";
    }
    else {
        numberInputField.style.border = "1px solid gray";
        resultTag.style.color = "black";
        status.textContent = "Processing: please have patients...";

        btn.disabled = true;
        btn.style.color = "gray";
        btn.style.cursor = "not-allowed";

        convertAmount(userEnteredAmount);
    }
}
function convertAmount(amount) {

    fetchData(`https://v6.exchangerate-api.com/v6/${api}/latest/USD`)
        .then(data => {

            const fromRates = data.conversion_rates[fromCurrencySelectTag.value];
            const toRates = data.conversion_rates[toCurrencySelectTag.value];

            const perRate = (1 * (toRates / fromRates)).toFixed(2);
            const convertedAmount = (amount * (toRates / fromRates)).toFixed(2);

            resultTag.style.color = "black";
            status.textContent = `1 ${fromCurrencySelectTag.value} = ${perRate} ${toCurrencySelectTag.value}`;
            resultTag.textContent = `${amount} ${fromCurrencySelectTag.value} = ${convertedAmount} ${toCurrencySelectTag.value}`;

            btn.disabled = false;
            btn.style.color = "black";
            btn.style.cursor = "pointer";
        })
        .catch(error => console.log(`Additional information about error: ${error}`));
}
async function fetchData(url) {

    try {
        const response = await fetch(url);

        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        return data;
    }
    catch (error) {
        resultTag.style.color = "red";
        resultTag.textContent = `Fetch API Error: ${error}`;

        throw error;
    }
}
