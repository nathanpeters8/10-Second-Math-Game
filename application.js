// when dom is ready
$(function () {
  var currentQuestion;
  var score = 0;
  var timeLeft = 10;

  // returns a random number between 0 and 10
  var randNumGen = function (size) {
    return Math.ceil(Math.random() * size);
  };

  // returns answer to math equation
  var solveEquation = function (num1, num2, sign) {
    if (sign === "+") {
      return num1 + num2;
    } else if (sign === "-") {
      return num1 - num2;
    } else if (sign === "*") {
      return num1 * num2;
    } else if (sign === "/") {
      return num1 / num2;
    } else {
      return -999;
    }
  };

  // generates and returns the equation and answer
  var equationGen = function (sign) {
    // generate two random numbers
    var num1 = randNumGen(10);
    var num2 = randNumGen(10);

    // object that stores equation and answer
    var question = {};
    question.equation = String(num1) + " " + sign + " " + String(num2);
    question.answer = solveEquation(num1, num2, sign);

    return question;
  };

  // generate question and inject equation into dom
  var newQuestion = function (sign) {
    var currentQuestion = equationGen(sign);
    console.log(currentQuestion);
    $("#equation-text").html(currentQuestion.equation);
    return currentQuestion;
  };

  var checkAnswer = function (input, answer) {
    //check if number inputted is correct answer
    if (Number(input) === answer) {
      //flash correct element
      $("#correct i").fadeIn(1000);
      $("#correct i").fadeOut(1000);

      //display new equation
      currentQuestion = newQuestion("+");

      updateTimer(1);
      updateScore(1);
    } else {
      //flash incorrect element
      $("#incorrect i").fadeIn(1000);
      $("#incorrect i").fadeOut(1000);
    }
  };

  //starts timer and stops it at 0
  var startTimer = function () {
    $("#timer-text").text("10");
    if(!timer) {
      if(timeLeft === 0) {
        updateTimer(10);
        updateScore(-score);
      }
    }
    //start timer
    var timer = setInterval(function () {
      updateTimer(-1);
      $("#timer-text").text(timeLeft);
      //if timer runs out
      if (timeLeft === 0) {
        clearInterval(timer);
        $("#number-input").attr("disabled", "disabled");
        $("#number-input").toggleClass("bg-danger-subtle");
        $("#play-button").removeAttr("disabled");
        $("#number-input").val("");
        timer = undefined;
      }
    }, 1000);
  };

  // add amount to timer
  var updateTimer = function (amount) {
    timeLeft += amount;
    $("#timer-text").text(timeLeft);
  };

  // add amount to score
  var updateScore = function (amount) {
    score += amount;
    $("#score").find("span").text(score);
  };

  /*---------- EVENT LISTENERS ----------- */

  //listen for enter key
  $(document).on("keypress", "#number-input", function (event) {
    if (event.which == 13) {
      //clear animations
      $("#correct i").finish();
      $("#correct i").finish();

      //check if number inputted is correct answer
      var input = $(this).val();

      //check for correct answer
      checkAnswer(input, currentQuestion.answer);

      // clear input box
      $(this).val("");
    }
  });

  // start timer when play now button pressed
  $(document).on("click", "#play-button", function () {
    currentQuestion = newQuestion("+");
    $("#play-button").attr("disabled", "disabled");
    $("#number-input").removeAttr("disabled");
    $("#number-input").toggleClass("bg-danger-subtle");
    $("#number-input").val("");
    startTimer();
  });

  

  newQuestion("+");
});
