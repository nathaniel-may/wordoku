
interface SudokuGen {
    generate(difficulty: number): string
    solve(puzzle: string): string
}

function generateWordoku(difficulty : number, sudoku: SudokuGen) : string {
    console.log("generating puzzle");
    var puzzle = sudoku.generate(difficultyScale(difficulty));
    var solution = sudoku.solve(puzzle);
    while (!unique(diagonal(solution))) {
        console.log("puzzle diagonal is not unique")
        console.log("generating another puzzle")
        puzzle = sudoku.generate(difficultyScale(difficulty));
        solution = sudoku.solve(puzzle);
    }
    console.log("puzzle with unique diagonal found!");
    console.log(puzzle)

    console.log("picking nine letter word")
    const word = pickWord();

    const wordoku = wordize(word, solution, puzzle);
    console.log("puzzle generated!");
    console.log(wordoku);
    return wordoku;
}

function pickWord() : string {
    console.log("picking random word");
    const word = wordlist[getRandomInt(0, wordlist.length)];
    console.log(word);

    switch (word) {
        case undefined : return "abcdefghi";
        default        : return word
    }
}

function wordize(word : string, solution : string, puzzle : string) : string {
    console.log("translating puzzle into letters");
    const diag = diagonal(solution);
    console.log("diag: " + diag)

    const letters = word.split('');
    const zipped = zip(fromArray(diag), fromArray(letters));

    const wordoku = 
        fromList(zipped).reduce((b, a) => b.split(a[0]).join(a[1]), puzzle)

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

type Nil = { tag: "nil" };
type Cons<A> = { tag: "cons", h: A, t: List<A> };
type List<A> = Nil | Cons<A>;

const nil : Nil = { tag : "nil" }
function cons<A>(h: A, t: List<A>) : List<A> {
    return { tag: "cons", h, t };
}

function fromArray<A>(xs: A[]) : List<A> {
    const [head, ...tail] = xs;
    if (head === undefined) {
        return nil;
    } else {
        return cons(head, fromArray(tail));
    }
}

function fromList<A>(xs: List<A>) : A[] {
    switch (xs.tag) {
        case "nil"  : return [];
        case "cons" : return [xs.h].concat(fromList(xs.t));
    }
}

function zip<A, B>(as: List<A>, bs: List<B>) : List<readonly [A, B]> {
    return zipWith((a, b) => [a, b] as const, as, bs);
}

function zipWith<A, B, C>(f: (a: A, b: B) => C, as: List<A>, bs: List<B>) : List<C> {
    switch (as.tag) {
        case "nil"  : return nil;
        case "cons" : switch (bs.tag) {
            case "nil"  : return nil;
            case "cons" : return cons(f(as.h, bs.h), zipWith(f, as.t, bs.t));
        }
    }
}

// function map<A, B>(f: (a: A) => B, xs: List<A>) : List<B> {
//     switch (xs.tag) {
//         case "nil"  : return nil;
//         case "cons" : return cons(f(xs.h), map(f, xs.t));
//     }
// }

// function foldl<A, B>(f: (b: B, a: A) => B, z: B, xs: List<A>) : B {
//     switch (xs.tag) {
//         case "nil"  : return z;
//         case "cons" : return f(foldl(f, z, xs.t), xs.h);
//     }
// }

// function foldr<A, B>(f: (a : A, b : B) => B, z: B, xs: List<A>) : B {
//     switch (xs.tag) {
//         case "nil"  : return z;
//         case "cons" : return foldr(f, f(xs.h, z), xs.t);
//     }
// }