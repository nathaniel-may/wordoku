import * as fp from "./fp";

// interface so that the generator can be easily swapped out
interface SudokuGen {
    generate(difficulty: number): string
    solve(puzzle: string): string
}

// main function for creating a puzzle
export function generateWordoku(difficulty : number, wordlist: readonly string[], sudoku: SudokuGen) : string {
    console.log("generating puzzle");
    const puzzle = sudoku.generate(difficultyScale(difficulty));
    const solution = sudoku.solve(puzzle);
    if (!unique(diagonal(solution))) {
        console.log("puzzle diagonal is not unique");
        return generateWordoku(difficulty, wordlist, sudoku)
    } else {
        console.log("puzzle with unique diagonal found!");
        console.log(puzzle)
    
        console.log("picking nine letter word")
        const word = pickWord(wordlist);
        console.log(word);

        const wordoku = wordize(word, solution, puzzle);
        console.log("puzzle generated!");
        console.log(wordoku);
        
        return wordoku;
    }
}

// impure function that returns a random word from a list
// defaults if the list is empty
function pickWord(wordlist: readonly string[]) : string {
    const word = wordlist[getRandomInt(0, wordlist.length)];
    switch (word) {
        case undefined : return "abcdefghi";
        default        : return word
    }
}

// takes a puzzle and its solution and returns the letter version
function wordize(word : string, solution : string, puzzle : string) : string {
    console.log("translating puzzle into letters");
    const diag = fp.fromArray(diagonal(solution));
    console.log("diag: " + diag)
    const letters = fp.fromArray(word.split(''));

    const wordoku = fp.foldl((b, a) => b.split(a[0]).join(a[1]), puzzle, fp.zip(diag, letters))
    console.log("translated: ");
    console.log(wordoku);

    return wordoku;
}

// returns the diagonal values
function diagonal(puzzle : string) : string[] {
    return [...Array(9).keys()]
        .map(x => puzzle.charAt(x * 10));
}

// takes input 0 (easy) - 50 (hard), 
// returns number of starting values
function difficultyScale(input : number) : number {
    return 50 - input + 17;
}

// takes an array
// returns true if all elements are unique
// returns false otherwise
function unique(arr : any[]) : boolean {
    function onlyUnique(value : any, index : number, self : any) {
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
function getRandomInt(min : number, max : number) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
}