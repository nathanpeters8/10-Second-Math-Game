// when dom is ready
$(function () {
  var currentQuestion;
  var currentOperator;
  var score = 0;
  var timeLeft = 10;
  var operatorsArray = [];

  /*-------------------------- FUNCTIONS -------------------------------*/

  // returns a random number between 0 and 10
  var randNumGen = function (size) {
    return Math.ceil(Math.random() * size);
  };

  // returns answer to math equation
  var solveEquation = function (num1, num2, sign) {
    if (sign === "+") {
      return num1 + num2;
    } else if (sign === "-") {
      // check if answer is negative
      if (num1 - num2 < 0) {
        return -999;
      }
      return num1 - num2;
    } else if (sign === "*") {
      return num1 * num2;
    } else if (sign === "/") {
      // check if total is negative or a decimal
      if (num1 / num2 < 0 || !Number.isInteger(num1 / num2)) {
        return -999;
      }
      return num1 / num2;
    } else {
      return -999;
    }
  };

  // generates and returns the equation and answer
  var equationGen = function (sign) {
    var limit = $("#limit-input").val();
    // generate two random numbers
    var num1 = randNumGen(limit);
    var num2 = randNumGen(limit);

    // object that stores equation and answer
    var question = {};
    question.equation = String(num1) + " " + sign + " " + String(num2);
    question.answer = solveEquation(num1, num2, sign);

    // generate new question if answer is not valid
    if (question.answer == -999) {
      question = equationGen(sign);
    }

    return question;
  };

  // generate question and inject equation into dom
  var newQuestion = function (sign) {
    var currentQuestion = equationGen(sign);
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
      currentOperator = randomOperator();
      currentQuestion = newQuestion(currentOperator);

      //update increase score and timer
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
    $("#timer-text").removeClass("text-danger");
    $("#timer-text").addClass("text-primary");
    if (!timer) {
      if (timeLeft === 0) {
        updateTimer(10);
        updateScore(-score);
      }
    }
    // start timer
    var timer = setInterval(function () {
      // count down timer
      updateTimer(-1);
      $("#timer-text").text(timeLeft);

      // change timer to red starting at 3 seconds remaining
      if (timeLeft <= 3) {
        $("#timer-text").removeClass("text-primary");
        $("#timer-text").addClass("text-danger");
      }

      if (timeLeft === 0) {
        // stop timer when it reaches 0
        clearInterval(timer);

        // disable and clear number input box
        $("#number-input").attr("disabled", "disabled");
        $("#number-input").toggleClass("bg-danger-subtle");
        $("#number-input").val("");

        // display the operators and number control divs
        $("#math-operators").removeClass("d-none");
        $("#number-control").removeClass("d-none");

        // enable operators checkboxes and play button
        $("#math-operators").find("input").removeAttr("disabled");
        $("#play-button").removeAttr("disabled");
        $("#limit-input").removeAttr("disabled");

        // check for high score
        highScoreCheck();

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

  // update the list of checkmarked operators
  var updateOperators = function () {
    operatorsArray = [];
    $("#math-operators")
      .find("input")
      .each(function () {
        if (this.checked) {
          operatorsArray.push(this.id);
        }
      });
  };

  // returns random operator from the array of checkmarked operators
  var randomOperator = function () {
    updateOperators();
    var randNum = randNumGen(operatorsArray.length) - 1;
    return operatorsArray[randNum];
  };

  // check and update if user beats the high score
  var highScoreCheck = function () {
    var highScore = Number($("#high-score").find("span").text());
    if (score > highScore) {
      highScore = score;
      $("#high-score").find("span").text(String(highScore));
    }
  };

  /*-------------------------- EVENT LISTENERS -------------------------------*/

  // listen for enter key press
  $(document).on("keypress", "#number-input", function (event) {
    if (event.which == 13) {
      // clear animations
      $("#correct i").finish();
      $("#correct i").finish();

      // check for correct answer
      var input = $(this).val();
      checkAnswer(input, currentQuestion.answer);

      // clear input box
      $(this).val("");
    }
  });

  // start timer when play button pressed
  $(document).on("click", "#play-button", function () {
    //check if at least one operator is checked
    if (operatorsArray.length > 0) {
      // get random operator and generate question
      currentOperator = randomOperator();
      currentQuestion = newQuestion(currentOperator);

      // disable checkboxes and play button
      $("#math-operators").find("input").attr("disabled", "disabled");
      $("#play-button").attr("disabled", "disabled");
      $("#limit-input").attr("disabled", "disabled");

      // hide the operators and number limit divs
      $("#math-operators").addClass("d-none");
      $("#number-control").addClass("d-none");

      // enable number input box
      $("#number-input").removeAttr("disabled");
      $("#number-input").toggleClass("bg-danger-subtle");
      $("#number-input").trigger("focus");
      $("#number-input").val("");

      // start the timer
      startTimer();
    } else {
      // alert user if there are no operators checked
      alert("Please select at least one operator.");
    }
  });

  // add/remove operator when checkboxes changed
  $(document).on("change", "#math-operators input", function () {
    updateOperators();
  });

  // change number limit
  $("#limit-input").on("input", function () {
    $("#number-control").find("h4").html(this.value);
  });

  // update operators and show new equation on load
  updateOperators();
  newQuestion("+");
});
