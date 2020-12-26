

document.getElementById("app").innerHTML = generateWordoku(10);

function generateWordoku(difficulty) {
    console.log("generating puzzle");
    var puzzle = sudoku.generate(difficultyScale(difficulty));
    while (!unique(diagonal(sudoku.solve(puzzle)))) {
        console.log("puzzle diagonal is not unique")
        console.log("generating another puzzle")
        puzzle = sudoku.generate(difficultyScale(difficulty))
    }
    console.log("puzzle with unique diagonal found!");
    console.log(puzzle)

    console.log("picking nine letter word")
    const word = "";

    const wordoku = wordize(word, puzzle);
    console.log("puzzle generated!");
    console.log(wordoku);
    return wordoku;
}

function pickWord() {
    console.log("picking random word");
    const word = wordlist[getRandomInt(0, wordlist.length)];
    console.log(word);
    return word;
}

function wordize(word, puzzle) {
    console.log("translating puzzle into letters");
    const diag = diagonal(puzzle);

    var wordoku = puzzle;
    for(i = 0; i < 10; i++) {
        wordoku = wordoku.split(diag[i]).join(word.charAt(i));
    }

    console.log("translated: ");
    console.log(wordoku);
    return wordoku;
}

// returns the diagonal values
function diagonal(puzzle) {
    return [...Array(9).keys()]
        .map(x => puzzle.charAt(x * 10));
}

// takes input 0 (easy) - 50 (hard), 
// returns number of starting values
function difficultyScale(input) {
    return 50 - input + 17;
}

// takes an array
// returns true if all elements are unique
// returns false otherwise
function unique(arr) {
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

    return arr.length === arr.filter(onlyUnique).length;
}

/*
* Returns a random integer between min (inclusive) and max (inclusive).
* The value is no lower than min (or the next integer greater than min
* if min isn't an integer) and no greater than max (or the next integer
* lower than max if max isn't an integer).
* Using Math.round() will give you a non-uniform distribution!
*/
function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
}