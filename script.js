const app = {};

app.getRecipes = function () {

};

app.showResults = function () {
    app.$totalCaloriesPerDay.text(`Your total daily calories are: ${app.totalCaloriesPerDay}`);
    app.$avgCaloriesPerMeal.text(`Your average calories per meal are: ${app.caloriesPerMeal}`);
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
    // console.log("BMR:", app.BMR);
    app.calculateTotalCaloriesPerDay();
};

app.calculateTotalCaloriesPerDay = function () {
    app.totalCaloriesPerDay = Math.round(app.BMR + (app.weightGoals * app.weightPoundsPerWeek));
    app.caloriesPerMeal = Math.round(app.totalCaloriesPerDay / app.numberOfMealsPerDay);
    // console.log("Total per day", app.totalCaloriesPerDay);
    // console.log("Calories per meal:", app.caloriesPerMeal);
    app.showResults();
};

app.cacheSelectors = function () {
    app.$inputForm =  $('#inputForm');
    app.$totalCaloriesPerDay = $('#totalCaloriesPerDay');
    app.$avgCaloriesPerMeal = $('#avgCaloriesPerMeal');
};

app.addEventListeners = function () {
   app.$inputForm.on('submit', function (e) {
        e.preventDefault();
        app.gender = $('input[name="gender"]:checked').val();
        app.age = parseInt($('#age').val());
        app.weight = parseInt($('#weight').val());
        app.height = parseInt($('#height').val());
        app.activityLevel = $('#activityLevel').val();
        app.weightGoals = $('input[name="weightGoals"]:checked').val();
        app.weightPoundsPerWeek = $('#weightPoundsPerWeek').val();
        app.numberOfMealsPerDay = parseInt($('#numberOfMealsPerDay').val());
        app.getBMR();
    });
};

app.init = function () {
    app.cacheSelectors();
    app.addEventListeners();
}

$(function () {
    app.init();
});