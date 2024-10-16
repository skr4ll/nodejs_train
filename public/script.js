const formEntry = document.getElementById("entry");
const buttonSubmit = document.getElementById("submitButton");
const inputFieldAmount = document.getElementById("amount");
const divAmountMissing = document.getElementById("amountMissingDiv");
const divErrorMessage = document.getElementById("errorDiv");
const table = document.getElementById("tbl");
const tableBody = document.getElementById("tblBody");

// Initiales Laden der Seite
window.onload = function() {
    loadEntries();
	setDate();
};

inputFieldAmount.addEventListener("input", (event) => {
    buttonSubmit.style.backgroundColor = "green";
    if (event.target.value === "") {
        buttonSubmit.style.backgroundColor = "grey";
    }
});

// Hier keydowns und Enter zum Form abschicken
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "Enter":
            if (inputFieldAmount.value !== ""){
                buttonSubmit.click();
            }
            else{
                divAmountMissing.innerHTML ="GIB BETRAG EIN";
                setTimeout(() => {
                    divAmountMissing.innerHTML = "";
                }, 1111);
            }
        break;
        
        case "Tab":
            event.preventDefault();
            inputFieldAmount.focus();
        break;
        
        case "ArrowDown":
            document.getElementById("lol").innerHTML = "LOOOOOOOOOOOOOOOOL";
        break;

        case "ArrowUp":
            document.getElementById("lol").innerHTML = "";
        break;
        
        default:
            break;
    }
});
let date = new Date();
console.log(date);
// Verarbeitung des Forms
formEntry.addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(this); // Erzeugt ein Objekt, dass die Formvars enthält
    const data = Object.fromEntries(formData.entries()); 
    try {
        const response = await fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data) // Body des HTTP Requests mit den Formdaten
        });

        if (!response.ok) {
            const errorData = await response.json();
            divErrorMessage.innerHTML = errorData.message;
            setTimeout(() => {
                divErrorMessage.innerHTML = "";
            }, 1111);
			return;
        }
        loadEntries();
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("An unexpected error occurred. Please try again.");
    }
});

// Lade DB Einträge in HTML Tabelle
async function loadEntries() {
    // Clearen der aktuellen HTML Tabelle (Wegen submit versuch)
    try {
        clearTableEntries();
        const response = await fetch("/entries");
        const result = await response.json();
        
        result.data.forEach(entry => {
            const row = document.createElement("tr");
			const daysLeft = daysLeftCalc(entry.date);
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.amount}€</td>
                <td>${(entry.amount / daysLeft).toFixed(2)}€/Day</td>`;
            tableBody.appendChild(row);
        });
        //table.appendChild(tableBody);
    } catch (error) {
        console.error("Error loading entries:", error);
    }
}










// Helpers:

function setDate() {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    document.getElementById("date").value = formattedDate;
	
}
function leapYear(year){
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function daysLeftCalc(date){
	const splitDate = date.split("-");
	const dayToCheck = Number(splitDate[2]);
	const monthToCheck = splitDate[1];
	const yearToCheck = splitDate[0];
	const isLeapYear = leapYear(yearToCheck);
	let monthDays = 31;
	
	switch(monthToCheck) {
		case "02":
			if(isLeapYear){
				monthDays = 29;
			}
			else{
				monthDays = 28;
			}
			break;
		case "04":
		case "06":
		case "09":
		case "11":
			monthDays = 30;
			break;
	}
	const remainingDays = monthDays - dayToCheck;
	return remainingDays;	
}

function clearTableEntries(){
     console.log(tableBody.firstElementChild);
    while(tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }
}




