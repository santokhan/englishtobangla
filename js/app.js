const form = document.getElementById("analyze");
const translate = document.getElementById("wordBan");
const wordDiv = document.getElementById("word");
const didYouMean = document.getElementById("didYouMean");
const search = document.getElementById("search");
const suggestionsContainer = document.getElementById("suggestionsContainer");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = new FormData(form);
  let search = input.get("search");
  //   console.log(search);

  translate.innerHTML = "";
  wordDiv.innerHTML = "";

  if (search.length > 0) {
    wordFinder(search);
  }
});

function wordFinder(word) {
  if (engBan[word]) {
    wordDiv.innerHTML = word;
    translate.innerHTML = engBan[word];
    didYouMean.innerHTML = "";
    suggestionsContainer.classList.add("hidden");
  } else {
    sugesstions(word);
  }
}

function sugesstions(e) {
  const word = e;
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "a2775fd457mshee7becf8ddf4cf7p18a353jsn61838be70d21",
      "X-RapidAPI-Host": "jspell-checker.p.rapidapi.com",
    },
    body: JSON.stringify({
      language: "enUS",
      fieldvalues: word,
      config: {
        forceUpperCase: false,
        ignoreIrregularCaps: false,
        ignoreFirstCaps: true,
        ignoreNumbers: true,
        ignoreUpper: false,
        ignoreDouble: false,
        ignoreWordsWithNumbers: true,
      },
    }),
  };

  fetch("https://jspell-checker.p.rapidapi.com/check", options)
    .then((response) => response.json())
    .then((response) => {
      const { suggestions } = response.elements[0].errors[0];
      console.log(suggestions);

      suggestionsContainer.classList.remove("hidden");
      suggestions.forEach((e) => {
        didYouMean.innerHTML += `<span class="suggestions px-2 hover:underline cursor-pointer">${e}</span>`;
      });

      suggestionsHandler();
    })
    .catch((err) => console.error(err));
}

function suggestionsHandler() {
  const sug = document.querySelectorAll(".suggestions");
  if (sug.length > 0) {
    sug.forEach((e) => {
      const sugWord = e;
      sugWord.addEventListener("click", function () {
        let getSugWord = sugWord.innerHTML;
        console.log(getSugWord);
        wordFinder(getSugWord);
        search.value = getSugWord;
      });
    });
  }
}
