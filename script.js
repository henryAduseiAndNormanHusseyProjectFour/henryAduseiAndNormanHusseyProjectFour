const app = {};
app.apiId = '9267f4f5';
app.apiKey = 'f5989c4d0fce10c4ab403955d5b8f21f';

app.reset = function() {
    app.$htmlBody.animate(
{
    scrollTop: $('#home').offset().top
    },
    750
);
    app.$inputForm[0].reset();
    app.$listOfRecipes.empty();
    app.$displayRecipesSection.toggleClass("hidden");
    app.$showCalorieResults.toggleClass("hidden");
    app.$recipeSection.toggleClass("hidden");
}

app.displayRecipes = function () {
    app.$displayRecipesSection.toggleClass('hidden');
    app.$listOfRecipes.empty();
    for (let i = 0; i < app.recipeResults.length; i++) {
        const recipe = app.recipeResults[i].recipe;
        const htmlToAppend = `
            <li>
                <div class="recipeImage">
                    <img src="${recipe.image}">
                </div>

                <div class="recipeDetails">
                    <h4>${recipe.label}</h4>
                    <p>Calories per serving: ${Math.round(
                      recipe.calories / recipe.yield
                    )}</p>
                    <p>${recipe.dietLabels.join(", ")}</p>
                    <p>Fat: ${recipe.digest[0].total.toFixed(2)}${
                    recipe.digest[0].unit
                    } Carbs: ${recipe.digest[1].total.toFixed(2)}${
                    recipe.digest[1].unit
                    } Protein: ${recipe.digest[2].total.toFixed(2)}${
                    recipe.digest[2].unit
                    }</p>
                    <p class="healthLabels">${recipe.healthLabels.join(
                      ", "
                    )}</p>
                    <p class="cautions">Cautions: ${recipe.cautions.join(
                      ", "
                    )}</p>
                    <a class="anchors" href="${
                      recipe.url
                    }" target="_blank">Click here to see recipe</a>
                </div>
            </li>

        `;
        app.$listOfRecipes.append(htmlToAppend);

    }
        app.$htmlBody.animate(
        {
            scrollTop: app.$displayRecipesSection.offset().top
        },
        750
    );
};

app.getRecipes = function () {
    $.ajax({
        url: `https://api.edamam.com/search?app_id=${app.apiId}&app_key=${app.apiKey}&q=${app.mealType}&calories=${app.caloriesPerMeal - 25}-${app.caloriesPerMeal + 25}&excluded=rolls&excluded=breakfast&health=alcohol-free&health=peanut-free`,
        method: 'GET',
        dataType: 'json',
        // data: {
        //     "app_id": app.apiId,
        //     "app_key": app.apiKey,
        //     q: app.mealType,
        //     calories: `${app.caloriesPerMeal - 25}-${app.caloriesPerMeal + 25}`,
        //     diet: app.dietType,
        //     // excluded: 'rolls&breakfast&lunch&snack&alcohol',
        //     health: `alcohol-free&health=peanut-free'`,
        //     // mealType: 'lunch',
        //     // cuisineType: 'indian'
        // }

    }).then(function (response) {
        console.log(response.hits);
        app.recipeResults = response.hits;
        app.displayRecipes();
    });
};

app.showCalorieResults = function () {
    app.$showCalorieResults.toggleClass('hidden');
    app.$recipeSection.toggleClass('hidden');
    app.$totalCaloriesPerDay.text(app.totalCaloriesPerDay);
    app.$avgCaloriesPerMeal.text(app.caloriesPerMeal);
    app.$htmlBody.animate({
        scrollTop: app.$showCalorieResults.offset().top
    },750);
};

app.getMaleBMR = function () {
    return Math.round((6.23 * app.weight) + (12.7 * app.height) + app.age * 6.8);
};

app.getFemaleBMR = function () {
    return Math.round((4.35 * app.weight) + (4.7 * app.height) + app.age * 4.7);  
};

app.getBMR = function () {
    if (app.gender === 'male') {
        app.BMR = app.getMaleBMR() * app.activityLevel;
    } else if (app.gender === 'female') {
        app.BMR = app.getFemaleBMR() * app.activityLevel;
    }
    app.calculateTotalCaloriesPerDay();

};

app.calculateTotalCaloriesPerDay = function () {
    app.totalCaloriesPerDay = Math.round(app.BMR + (app.weightGoals * app.weightPoundsPerWeek));
    app.caloriesPerMeal = Math.round(app.totalCaloriesPerDay / app.numberOfMealsPerDay);
    app.showCalorieResults();
};

app.cacheSelectors = function () {
    app.$inputForm =  $('#inputForm');
    app.$totalCaloriesPerDay = $('#totalCaloriesPerDay');
    app.$avgCaloriesPerMeal = $('#avgCaloriesPerMeal');
    app.$getRecipes = $('#getRecipes');
    app.$listOfRecipes = $('#listOfRecipes');
    app.$showCalorieResults = $('#showCalorieResults');
    app.$recipeSection = $('#recipeSection');
    app.$htmlBody = $('html, body');
    app.$displayRecipesSection = $('.displayRecipesSection');
    app.$startAgain = $('#startAgain');
    app.$age = $('#age');
    app.$weight = $('#weight');
    app.$height = $('#height');
    app.$activityLevel = $('#activityLevel');
    app.$startJourney = $('#startJourney');
    app.$inputSection = $('.inputSection');

};

app.addEventListeners = function () {
    app.$startJourney.on('click', function () {
        app.$htmlBody.animate(
            {
            scrollTop: app.$inputSection.offset().top
            },
            300
        );
    });

   app.$inputForm.on('submit', function (e) {
        e.preventDefault();
        app.gender = $('input[name="gender"]:checked').val();
        app.age = parseInt(app.$age.val());
        app.weight = parseInt(app.$weight.val());
        app.height = parseInt(app.$height.val());
        app.activityLevel = (app.$activityLevel.val());
        app.weightGoals = $('input[name="weightGoals"]:checked').val();
        app.weightPoundsPerWeek = $('#weightPoundsPerWeek').val();
        app.numberOfMealsPerDay = parseInt($('#numberOfMealsPerDay').val());
        app.getBMR();
    });

    app.$getRecipes.on('submit', function (e) {
        e.preventDefault();
        app.mealType = $('#mealType').val();
        app.dietType = $('#dietType').val();
        app.getRecipes();
    });

    app.$startAgain.on('click', function () {
        app.reset();
    });



};

app.init = function () {
    app.cacheSelectors();
    app.addEventListeners();
}

$(function () {
    app.init();
});