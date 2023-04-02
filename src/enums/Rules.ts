import {Game} from "./GameNames";

export const Rules = {
    [Game.Tik_Tak_Toe]: {
        title: "Tic Tac Toe is a two-player game played on a 3x3 square grid.",
        enumRules: [
            "Players take turns placing their symbols (one player places Xs, the other places Os) on empty squares on the grid.",
            "The goal of the game is to get three of your symbols in a row (horizontally, vertically, or diagonally) or to fill all the squares on the grid without getting three in a row.",
            "If a player succeeds in getting three symbols in a row, they win the game.",
            "If all the squares are filled and no player has three in a row, the game is a tie.",
            "The player who first gets three symbols in a row or fills all the squares on the grid is declared the winner."
        ]
    },
    [Game.Bulls_And_Cows]: {
        title: "Bulls and Cows is a two-player game in which one player thinks of a four-digit number with no repeating digits, and the other player tries to guess the number.",
        enumRules: [
            "The player who thinks of the number selects a four-digit number with no repeating digits (for example, 4827).",
            "The other player makes a guess and calls out a four-digit number.",
            "The player who thought of the number responds with the number of \"bulls\" and \"cows\" in the guessed number. A bull is a digit in the right position, and a cow is a digit that is in the number, but in the wrong position.",
            "The guessing player makes a new guess based on the feedback and continues the game until they correctly guess the number.",
            "The player who correctly guesses the number first is the winner."
        ],
        example: "Let's say the player who thinks of the number chooses the number 4827. The guessing player offers the number 1234. The player who thought of the number responds that there are no correct digits in this number, so the number of bulls and cows is 0: \"0 bulls, 0 cows\". The guessing player makes a new guess and continues until they guess the number 4827."
    }
}