import { config } from 'dotenv'

config()

// I think a function is smarter as it will be evaluated for ech call and isn't set for the whole execution
export const flipACoin = () => Math.random() < 0.5

// random rounded numbers
export const randomNumberInInterval = (min: number, max: number): number =>  {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// check if a team is the preferred one
export const isPreferredTeam = (currentTeam: string): boolean => currentTeam === env('FAVORITE')

// check if one team is the preferred team
export const isPreferredTeamInTeams = (teams: string[]) => teams.includes(env('FAVORITE'))

// round up and down depending on coin flip
// for testing flipACoin should be an argument
export const getRandomGoal = (odd: number): number => flipACoin() ? Math.ceil(odd) : Math.floor(odd)

// preferred teams always one additional goals
export const getPreferredGoal = (isPreferredTeam: boolean, randomGoal: number): number => {
    const bonus = Number(env('FAVORITE_BONUS'))
    return isPreferredTeam ? (randomGoal + bonus) : randomGoal
}

// user defines a threshold in which range a tie is realistic
export const isTieRealistic = (odds: number[]): boolean => {
    const tieThreshold = Number(env('TIE_THRESHOLD'))
    return Math.abs(odds[1] - odds[0]) <= tieThreshold
        || Math.abs(odds[1] - odds[2]) <= tieThreshold
}

// get env and throw error if it isn't possible
export const env = (key: string): string => {
    const result = process.env[key]
    if(result) {
        return result
    }
    throw new Error(`Secret couldn't be loaded from env: ${key}`)
}