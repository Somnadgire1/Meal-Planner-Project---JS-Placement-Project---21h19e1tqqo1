const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const activityInput = document.getElementById("activity");
const submit = document.getElementById("submitBtn");
const cardContainer = document.getElementById("cards-container");
const mealsDetails = document.getElementById("details");
const ingredientSection = document.getElementById("ingredients");
const stepsSection = document.getElementById("steps");
const equipmentSection = document.getElementById("equipment");
const recipeSection = document.getElementById("recipe-section");
const API_KEY = "3a147c8ef9854d828c785764252802a0";

// calori calculation
const getCalorie = () => {
  let hv = heightInput.value;
  let wv = weightInput.value;
  let av = ageInput.value;
  let gv = genderInput.value;
  let avv = activityInput.value;
  let calori;

  if (hv === "" || hv <= 0 || wv === "" || wv <= 0 || av === "" || av <= 0) {
    alert("Input field must Required");
    return;
  }
//else
//bmr function
  if (gv === "female") {
    //**For women**
    calori = 655.1 + 9.563 * wv + 1.85 * hv - 4.676 * av;
  } else if (gv === "male") {
    //**For men**
    calori = 66.47 + 13.75 * wv + 5.003 * hv - 6.755 * av;
  }
//bmr - calori
  // Daily Calorie Requirement
  if (avv === "light") {
    //**Lightly active (exercise 1–3 days/week)**
    calori *= 1.375;
  } else if (avv === "moderate") {
    //**Moderately active (exercise 3–5 days/week)**
    calori *= 1.55;
  } else if (avv === "active") {
    //**Active (exercise 6–7 days/week)**
    calori *= 1.725;
  }

  getMeals(calori);
};

const getMeals = async (calori) => {
  document.getElementById("loader").style.display = "block";
  const url = `https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=${calori}&apiKey=${API_KEY}&includeNutrition=true`;
// console.log(url)
  let datas;
  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      datas = data;
    });
  generateMealsCard(datas);
  document.getElementById("loader").style.display = "none";
};

const generateMealsCard = (datas) => {
  let cards = ``;
  mealsDetails.innerHTML = `
    <div class="title-meal">
        <span>BREAKFAST</span>
        <span>LUNCH</span>
        <span>DINER</span>
    </div>
    `;
  datas.meals.map(async (data) => {
    const url = `https://api.spoonacular.com/recipes/${data.id}/information?apiKey=${API_KEY}&includeNutrition=false`;
    // console.log(url)
    let imgURL;
    await fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        imgURL = data.image;
      });
    cards += `
        <div class="col-md-4 d-flex justify-content-center mb-2">
            <div class="card" style="width: 18rem;">
                <img src=${imgURL} class="card-img-top"
                    alt="meal 1">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p class="px-2">Calories : ${datas?.nutrients?.calories}</p>
                    <button class="btn-recipe" onClick="btnRecipe(${data.id})">Get Recipe</button>
                </div>
            </div>
        </div>
        `;
    cardContainer.innerHTML = cards;
  });
};
//fetch recipy
const btnRecipe = async (data) => {
  recipeSection.innerHTML = "";
  ingredientSection.innerHTML = "";
  stepsSection.innerHTML = "";
  equipmentSection.innerHTML = "";
  const url = `https://api.spoonacular.com/recipes/${data}/information?apiKey=${API_KEY}&includeNutrition=false`;
  let information;
// console.log(url)
  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      information = data;
    });
  //title of recipy
  recipeSection.textContent = `${information.title} Recipe`;

  //   Ingridents
  let htmlData = ``;
  let inCardDiv = document.createElement("div");
  inCardDiv.classList.add("card", "h-100"); //h-100=div's height
  let inCardBody = document.createElement("div");
  inCardBody.classList.add("card-body");
  let inOverlay = document.createElement("div");
  inOverlay.classList.add("overlay"); //.overlay class applies a default background-color: #000; with opacity: 0.5.
  let ol = document.createElement("ol");
  information.extendedIngredients.map((ingre) => {
    htmlData += `<li>${ingre.original}</li>`; // original=> ingredient data
  });
  ol.innerHTML = htmlData;
  let ingreH1 = document.createElement("h3");
  ingreH1.textContent = "INGREDIENTS";
  inCardBody.appendChild(inOverlay);
  inCardBody.appendChild(ingreH1);
  inCardBody.appendChild(ol);
  inCardDiv.appendChild(inCardBody);
  ingredientSection.appendChild(inCardDiv);

  //   Steps
  let stepsHtml = ``;
  let stCardDiv = document.createElement("div");
  stCardDiv.classList.add("card", "h-100");
  let stCardBody = document.createElement("div");
  stCardBody.classList.add("card-body");
  let stOverlay = document.createElement("div");
  stOverlay.classList.add("overlay");
  let stepsOl = document.createElement("ol");
  information.analyzedInstructions[0].steps.map((step) => {
    stepsHtml += `<li>${step.step}</li>`;  //step=>step's data
  });
  stepsOl.innerHTML = stepsHtml;
  let stepsH1 = document.createElement("h3");
  stepsH1.textContent = "STEPS";
  stCardBody.appendChild(stOverlay);
  stCardBody.appendChild(stepsH1);
  stCardBody.appendChild(stepsOl);
  stCardDiv.appendChild(stCardBody);
  stepsSection.appendChild(stCardDiv);

  // fetch equipments
  const urlEquip = `https://api.spoonacular.com/recipes/${data}/equipmentWidget.json?apiKey=${API_KEY}&includeNutrition=false`;
  let equip;
// console.log(urlEquip)
  await fetch(urlEquip)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      equip = data;
    });

  let equipData = ``;
  let eqCardDiv = document.createElement("div");
  eqCardDiv.classList.add("card", "h-100");
  let eqCardBody = document.createElement("div");
  eqCardBody.classList.add("card-body");
  let eqOverlay = document.createElement("div");
  eqOverlay.classList.add("overlay");
  let equipUl = document.createElement("ol");
  equip.equipment.map((equip) => {
    equipData += `<li>${equip.name}</li>`; //name=>equipment data
  });
  equipUl.innerHTML = equipData;
  let equipH1 = document.createElement("h3");
  equipH1.textContent = "EQUIPMENT";
  eqCardBody.appendChild(eqOverlay);
  eqCardBody.appendChild(equipH1);
  eqCardBody.appendChild(equipUl);
  eqCardDiv.appendChild(eqCardBody);
  equipmentSection.appendChild(eqCardDiv);
};

submit.addEventListener("click", getCalorie);
