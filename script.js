const app = {};

app.getMaleBMR = function () {
    return (6.23 * app.weight) + (12.7 * app.height) + app.age * 6.8;
};

app.getFemaleBMR = function () {
    return (4.35 * app.weight) + (4.7 * app.height) + app.age * 4.7;  
};

app.getBMR = function () {
    if (app.gender === 'male') {
        app.BMR = app.getMaleBMR() * app.activityLevel;
    } else if (app.gender === 'female') {
        app.BMR = app.getFemaleBMR() * app.activityLevel;
    }
    console.log(app.BMR);
};

app.cacheSelectors = function () {
    app.$inputForm =  $('#inputForm');
};

app.addEventListeners = function () {
   app.$inputForm.on('submit', function (e) {
        e.preventDefault();
        app.gender = $('input[type="radio"]:checked').val();
        app.age = $('#age').val();
        app.weight = $('#weight').val();
        app.height = $('#height').val();
        app.activityLevel = $('#activityLevel').val();
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