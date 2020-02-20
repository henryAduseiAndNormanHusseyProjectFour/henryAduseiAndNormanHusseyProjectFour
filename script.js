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

    setTimeout(function() {
        app.$inputForm[0].reset();
        app.$weightPoundsPerWeek.addClass('hidden');
        app.$listOfRecipes.empty();
        app.$getRecipesButton.text('Get Recipes');
        app.$getRecipesButton.attr('disabled', false);
        app.$getRecipesButton.css('background-color', 'var(--colourPrimaryDark)');
        app.$displayRecipesSection.toggleClass("hidden");
        app.$showCalorieResults.toggleClass("hidden");
        app.$recipeSection.toggleClass("hidden");
    },750);
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
                    <p class="dietLabels">${recipe.dietLabels.join(", ")}</p>
                    <p>Per serving: </p>
                    <p>Calories: ${Math.round(recipe.calories / recipe.yield)}</p>
                    <p class="nutrients">
                        <span>Fat: ${(recipe.digest[0].total / recipe.yield).toFixed(0)}${recipe.digest[0].unit}</span>
                        <span>Carbs: ${(recipe.digest[1].total / recipe.yield).toFixed(0)}${recipe.digest[1].unit} </span>
                        <span>Protein: ${(recipe.digest[2].total / recipe.yield).toFixed(0)}${recipe.digest[2].unit}</span>
                    </p>
                    <p class="healthLabels">${recipe.healthLabels.join(", ")}</p>
                    <p class="cautions">Cautions: ${recipe.cautions.join( ", ")}</p>
                    <a class="anchors" href="${recipe.url}" target="_blank">Click here to see recipe</a>
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

app.noRecipesFound = function () {
    app.$displayRecipesSection.toggleClass('hidden');
    app.$listOfRecipes.empty();
    const htmlToAppend = `
        <li class="noResults">
            <h4>Sorry, no results found.</h4>
        </li>
    `;
    app.$listOfRecipes.append(htmlToAppend);
    app.$htmlBody.animate(
        {
            scrollTop: app.$displayRecipesSection.offset().top
        },
        750
    );
};

app.getExcluded = function() {
    app.excluded = '';
    if (app.mealType === 'breakfast') {
        app.excluded = '&excluded=lunch&excluded=dinner&excluded=snack';
    } else if (app.mealType === 'lunch') {
        app.excluded = "&excluded=breakfast&excluded=dinner&excluded=snack";
    } else if (app.mealType === 'dinner') {
         app.excluded = "&excluded=lunch&excluded=breakfast&excluded=snack&excluded=rolls";
    } else if (app.mealType === 'snack') {
        app.excluded = "&excluded=lunch&excluded=dinner&excluded=breakfast";
    }
}

app.getRecipes = function () {
    $.ajax({
        url: `https://api.edamam.com/search?app_id=${app.apiId}&app_key=${app.apiKey}&q=${app.mealType}&calories=${app.caloriesPerMeal - 25}-${app.caloriesPerMeal + 25}${app.excluded}&health=alcohol-free${app.restrictions}&diet=${app.dietType}`,
        method: 'GET',
        dataType: 'json',
    }).then(function (response) {
        app.recipeResults = response.hits;
        if (app.recipeResults.length > 0)  {
            app.displayRecipes();
        } else {
            app.noRecipesFound();
        }
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
    if (app.measurementChoice === 'imperial') {
        return Math.round((6.23 * app.weight) + (12.7 * app.height) + app.age * 6.8);
    } else {
        return Math.round((13.7 * app.weight) + (5 * app.height) + app.age * 6.8);
    }
};

app.getFemaleBMR = function () {
    if (app.measurementChoice === 'imperial') {
        return Math.round((4.35 * app.weight) + (4.7 * app.height) + app.age * 4.7);  
    } else {
        return Math.round((9.6 * app.weight) + (1.8 * app.height) + app.age * 4.7);  
    }
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
    app.$weightGoalsOptions = $('input[name="weightGoals"]');
    app.$measurementOptions = $('input[name="measurement"]');
    app.$weightGoalsChecked = $('input[name="weightGoals"]:checked');
    app.$weightPoundsPerWeek = $('#weightPoundsPerWeek');
    app.$totalCaloriesPerDay = $('#totalCaloriesPerDay');
    app.$avgCaloriesPerMeal = $('#avgCaloriesPerMeal');
    app.$getRecipes = $('#getRecipes');
    app.$getRecipesButton = $('#getRecipesButton');
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

    app.$weightGoalsOptions.change(function () {
        if ($(this).val() == 0) {
            app.$weightPoundsPerWeek.addClass('hidden');
        } else {
            app.$weightPoundsPerWeek.removeClass('hidden');
        }
    });

    app.$measurementOptions.change(function () {
        if ($(this).val() == 'imperial') {
            $('#weightMeasurement').text('pounds');
            $('#heightMeasurement').text('inches');
        } else {
            $('#weightMeasurement').text('kg');
            $('#heightMeasurement').text('cm');
        }
    });

   app.$inputForm.on('submit', function (e) {
        e.preventDefault();
        app.gender = $('input[name="gender"]:checked').val();
        app.age = parseInt(app.$age.val());
        app.measurementChoice = $('input[name="measurement"]:checked').val();
        app.weight = parseInt(app.$weight.val());
        app.height = parseInt(app.$height.val());
        app.activityLevel = (app.$activityLevel.val());
        app.weightGoals = app.$weightGoalsChecked.val();
        app.weightPoundsPerWeek = $('#weightPoundsPerWeek').val();
        app.numberOfMealsPerDay = parseInt($('#numberOfMealsPerDay').val());
        app.getBMR();
    });

    app.$getRecipes.on('submit', function (e) {
        e.preventDefault();
        app.mealType = $('#mealType').val();
        app.dietType = $('#dietType').val();
        app.restrictions = "";
        $('input[name="restrictions"]:checked').each(function () {
            app.restrictions += `&health=${$(this).val()}`;
        });
        
        app.$getRecipesButton.text('Getting Recipes...');
        app.$getRecipesButton.attr('disabled', true);
        app.$getRecipesButton.css('background-color', 'var(--colourSecondaryLight)');
        app.getExcluded();
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