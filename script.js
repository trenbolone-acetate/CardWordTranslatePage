$(document).ready(function () {
    var randomWord='';
    var translatedRandomWord ='';
    var randomWordDescription = '';

    var maxWords = 10;
    var currentWord = 1;
    var correctCount = 0;
    var incorrectCount = 0;
  
    function getRandomWord() {
      return words[Math.floor(Math.random() * words.length)];
    }

    function describeFetchedWord(word) {
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/dictionary?word=' + word,
            headers: { 'X-Api-Key': '5sGcQ9C8R0DivJYoSuUUng==O2sUYjThn1x3z6L7'},
            contentType: 'application/json',
            success: function(result) {
                console.log(result.definition);
                randomWordDescription = result.definition;
                $("#card p").text(result.definition);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    }

    function translateFetchedWord(word) {
        const options = {
          method: "POST",
          url: "https://api.edenai.run/v2/translation/automatic_translation",
          headers: {
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjAxZGJjZmMtYjIzNS00MWM2LWEyZjUtNmI5Mjc5MjFhOGFjIiwidHlwZSI6ImFwaV90b2tlbiJ9.3ZeJD0L7iDNwh4REex0GofmEW-Ftmz-Lew9s6ViMJgw",
          },
          data: {
            show_original_response: false,
            fallback_providers: "",
            providers: "amazon,google,ibm,microsoft",
            text: word,
            source_language: "en",
            target_language: "uk",
          },
        };
        
        axios
        .request(options)
        .then((response) => {
          console.log(response.data.google ? response.data.google.text : response.data[0].text );
          translatedRandomWord = response.data.google ? response.data.google.text  : response.data[0].text ;
        })
        .catch((error) => {
          console.error(error);
        });
    }

    function fetchRandomWord(){
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/randomword',
            headers: { 'X-Api-Key': '5sGcQ9C8R0DivJYoSuUUng==O2sUYjThn1x3z6L7'},
            contentType: 'application/json',
            success: function(result) {
                console.log(result.word);
                result.word = result.word.charAt(0).toUpperCase() + result.word.slice(1);
                $("#card h4").text(result.word);
                translateFetchedWord(result.word);
                describeFetchedWord(result.word);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    }

    function updateCard() {
      randomWord = fetchRandomWord();
    }
    

    $("#checkButton").click(function () {
      var userTranslation = $("#translationInput").val().trim().toLowerCase();
  
      if (userTranslation === translatedRandomWord.toLowerCase()) {
        correctCount++;
        $("#score").css('background-color', 'green');
        setTimeout(function() {
            $("#score").css('background-color', 'initial');
          }, 500);
      } else {
        incorrectCount++;
        $("#score").css('background-color', 'red');
        setTimeout(function() {
            $("#score").css('background-color', 'initial');
          }, 500);
      }
  
      if (currentWord === maxWords) {
        updateScore();
        showResultModal();
      } else {
        currentWord++;
        updateCard();
        updateScore();
        $("#translationInput").val('');
      }
    });
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          $("#checkButton").click();
        }
    });
    function updateScore() {
        $("#progress").html(`Word <span id="currentStep">${currentWord}</span> of 10`);
      $("#correctCount").text(correctCount);
      $("#incorrectCount").text(incorrectCount);
    }
  
    function showResultModal() {
        $(":button").prop("disabled", true);
        $(":input").prop("disabled", true);
      var proficiencyLevel = calculateProficiencyLevel();
      $("#proficiencyLevel").text(proficiencyLevel);
      $("#resultModal").show();
    }
  
    function calculateProficiencyLevel() {
      var percentage = (correctCount / maxWords) * 100;
  
      if (percentage >= 80) {
        return "Advanced";
      } else if (percentage >= 60) {
        return "Intermediate";
      } else {
        return "Beginner";
      }
    }
  
    $(".close").click(function () {
      $("#resultModal").hide();
    });
  
    updateCard();
    updateScore();
  });
  