
// interface so that the generator can be easily swapped out
interface SudokuGen {
    generate(difficulty: number): string
    solve(puzzle: string): string
}

// main function for creating a puzzle
function generateWordoku(difficulty : number, wordlist: string[], sudoku: SudokuGen) : string {
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
function pickWord(wordlist: string[]) : string {
    const word = wordlist[getRandomInt(0, wordlist.length)];
    switch (word) {
        case undefined : return "abcdefghi";
        default        : return word
    }
}

// takes a puzzle and its solution and returns the letter version
function wordize(word : string, solution : string, puzzle : string) : string {
    console.log("translating puzzle into letters");
    const diag = fromArray(diagonal(solution));
    console.log("diag: " + diag)
    const letters = fromArray(word.split(''));

    const wordoku = foldl((b, a) => b.split(a[0]).join(a[1]), puzzle, zip(diag, letters))
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

// singly linked list using type tags to emulate abstract data types.
type Nil = { tag: "nil" };
type Cons<A> = { tag: "cons", h: A, t: List<A> };
type List<A> = Nil | Cons<A>;

// nil value
const nil : Nil = { tag : "nil" }

// cons function
function cons<A>(h: A, t: List<A>) : List<A> {
    return { tag: "cons", h, t };
}

// converts an array of all one type to a list
function fromArray<A>(xs: A[]) : List<A> {
    const [head, ...tail] = xs;
    if (head === undefined) {
        return nil;
    } else {
        return cons(head, fromArray(tail));
    }
}

// converts a list to an array
function fromList<A>(xs: List<A>) : A[] {
    switch (xs.tag) {
        case "nil"  : return [];
        case "cons" : return [xs.h].concat(fromList(xs.t));
    }
}

// zips two lists together. the length of the list will be the length
// of the shorter of the two lists.
//
// ex. (using array syntax for Lists)
// > zip([1,2,3], ['a', 'b', 'c'])
// > [[1, 'a'],[2, 'b'], [3, 'c']]
function zip<A, B>(as: List<A>, bs: List<B>) : List<readonly [A, B]> {
    return zipWith((a, b) => [a, b] as const, as, bs);
}

// zips two lists together with a function to form a new list
//
// ex. (using array syntax for Lists)
// > zipWith((a, b) => (a*2) + "-" + b, [1,2,3], ['a', 'b', 'c'])
// > ["2-a", "4-b", "6-c"]
function zipWith<A, B, C>(f: (a: A, b: B) => C, as: List<A>, bs: List<B>) : List<C> {
    switch (as.tag) {
        case "nil"  : return nil;
        case "cons" : switch (bs.tag) {
            case "nil"  : return nil;
            case "cons" : return cons(f(as.h, bs.h), zipWith(f, as.t, bs.t));
        }
    }
}

function foldl<A, B>(f: (b: B, a: A) => B, z: B, xs: List<A>) : B {
    switch (xs.tag) {
        case "nil"  : return z;
        case "cons" : return f(foldl(f, z, xs.t), xs.h);
    }
}

// function map<A, B>(f: (a: A) => B, xs: List<A>) : List<B> {
//     switch (xs.tag) {
//         case "nil"  : return nil;
//         case "cons" : return cons(f(xs.h), map(f, xs.t));
//     }
// }

// function foldr<A, B>(f: (a : A, b : B) => B, z: B, xs: List<A>) : B {
//     switch (xs.tag) {
//         case "nil"  : return z;
//         case "cons" : return foldr(f, f(xs.h, z), xs.t);
//     }
// }