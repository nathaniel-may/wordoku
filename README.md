# wordoku

Generates a sudoku that uses letters instead of numbers. These puzzles have the additional constraint that the "top left to bottom right" diagonal forms a nine-letter word. All words for these puzzles have nine unique letters.

## dev

compile typescript:
```
> tsc && browserify target/app.js --standalone main > target/bundle.js
```

there are no tests at this time

## future work
- make the html UI human readable
- add tests
- swap out for a generator that always gives puzzles with unique solutions
- write a custom wordoku generator instead of mapping ontop of an existing generator