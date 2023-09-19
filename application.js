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

// when dom is ready
$(function () {
  // generate question and inject equation into dom
  var currentQuestion = equationGen("+");
  console.log(currentQuestion);
  $("#equation-text").html(currentQuestion.equation);
});
