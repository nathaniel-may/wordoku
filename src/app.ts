import { wordlist } from "./wordlist"
import { generateWordoku } from "./wordoku"
import { sudoku } from "./sudoku"

export function main(difficulty: number) : string {
    return generateWordoku(difficulty, wordlist, sudoku);
}