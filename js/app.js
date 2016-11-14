// State object
var state = {
  questions: [
    {
      text: "Which number am I thinking of?",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 0
    },
    {
      text: "What about now, can you guess now?",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 1
    },
    {
      text: "I'm thinking of a number between 1 and 4. What is it?",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 2,
    },
    {
      text: "If I were a number between 1 and 4, which would I be?",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 3,
    },
    {
      text: "Guess what my favorite number is",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 0,
    }
  ],
  praises : [
    "Wow. You got it right. I bet you feel really good about yourself now",
    "Correct. Which would be impressive, if it wasn't just luck",
    "Oh was I yawning? Because you getting that answer right was boring me to sleep",
    "Hear all that applause for you because you got this question right? Neither do I."
  ],

  admonishments: [
    "Really? That's your guess? WE EXPECTED BETTER OF YOU!",
    "Looks like someone wasn't paying attention in telepathy school, geesh!",
    "That's incorrect. You've dissapointed yourself, your family, your city, state, country and planet, to say nothing of the cosmos"
  ],
  score: 0,
  currentQuestionIndex: 0,
  route: 'start',
  lastAnswerCorrect: false,
  feedbackRandom: 0
};

// State modification functions
var setRoute = (state, route) => state.route = route;

var resetGame = state => {
  state.score = 0;
  state.currentQuestionIndex = 0;
  setRoute(state, 'start');
};

var answerQuestion = (state, answer) => {
  var {questions, currentQuestionIndex} = state;
  var currentQuestion = questions[currentQuestionIndex];
  
  state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;

  if (state.lastAnswerCorrect) {
    state.score++;
  }
  
  selectFeedback(state);
  setRoute(state, 'answer-feedback');
};

var selectFeedback = state => state.feedbackRandom = Math.random();

var advance = state => {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex === state.questions.length) {
    setRoute(state, 'final-feedback');
  }
  else {
    setRoute(state, 'question');
  }
};

// Render functions
var renderApp = (state, elements) => {
  // default to hiding all routes, then show the current route
  Object.keys(elements).forEach(route =>  elements[route].hide());

  var {route} = state;
  var element = elements[route];
  element.show();

  if (route === 'start') {
      renderStartPage(state, element);
  }
  else if (route === 'question') {
      renderQuestionPage(state, element);
  }
  else if (route === 'answer-feedback') {
    renderAnswerFeedbackPage(state, element);
  }
  else if (route === 'final-feedback') {
    renderFinalFeedbackPage(state, element);
  }
};

// at the moment, `renderStartPage` doesn't do anything, because
// the start page is preloaded in our HTML, but we've included
// the function and used above in our routing system so that this
// application view is accounted for in our system
var renderStartPage = (state, element) => {};

var renderQuestionPage = (state, element) => {
  renderQuestionCount(state, element.find('.question-count'));
  renderQuestionText(state, element.find('.question-text'));
  renderChoices(state, element.find('.choices'));
};

var renderAnswerFeedbackPage = (state, element) => {
  renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
  renderAnswerFeedbackText(state, element.find(".feedback-text"));
  renderNextButtonText(state, element.find(".see-next"));
};

var renderFinalFeedbackPage = (state, element) => {
  renderFinalFeedbackText(state, element.find('.results-text'));
};

var renderQuestionCount = (state, element) => {
  let text = `${state.currentQuestionIndex + 1} / ${state.questions.length}`;
  element.text(text);
};

var renderQuestionText = (state, element) => {
  let currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.text);
};

var renderChoices = (state, element) => {
  let currentQuestion = state.questions[state.currentQuestionIndex];
  
  let choices = currentQuestion.choices.map((choice, index) =>
      `<li><input type="radio" name="user-answer" value="${index}" ` +
      `required><label>${choice}</label></li>`
  );
  
  element.html(choices);
};

var renderAnswerFeedbackHeader = (state, element) => {
  let html = state.lastAnswerCorrect ?
      "<h6 class='user-was-correct'>correct</h6>" :
      "<h1 class='user-was-incorrect'>Wrooonnnngggg!</>";

  element.html(html);
};

var renderAnswerFeedbackText = (state, element) => {
  let choices = state.lastAnswerCorrect ? state.praises : state.admonishments;
  let text = choices[Math.floor(state.feedbackRandom * choices.length)];
  element.text(text);
};

var renderNextButtonText = (state, element) => {
    let text = state.currentQuestionIndex < state.questions.length - 1 ?
      "Next" : "How did I do?";
  element.text(text);
};

var renderFinalFeedbackText = (state, element) => {
  let text = `You got ${state.score} out of ${state.questions.length} ` + 
  `questions right.`;
  element.text(text);
};

// Event handlers
const PAGE_ELEMENTS = {
  'start': $('.start-page'),
  'question': $('.question-page'),
  'answer-feedback': $('.answer-feedback-page'),
  'final-feedback': $('.final-feedback-page')
};

$("form[name='game-start']").submit(event => {
  event.preventDefault();
  setRoute(state, 'question');
  renderApp(state, PAGE_ELEMENTS);
});

$(".restart-game").click(event => {
  event.preventDefault();
  resetGame(state);
  renderApp(state, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(event => {
  event.preventDefault();
  let answer = $("input[name='user-answer']:checked").val();
  answer = parseInt(answer, 10);
  answerQuestion(state, answer);
  renderApp(state, PAGE_ELEMENTS);
});

$(".see-next").click(event => {
  advance(state);
  renderApp(state, PAGE_ELEMENTS);
});

$(() => renderApp(state, PAGE_ELEMENTS));
