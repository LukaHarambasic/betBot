import { config } from 'dotenv'

config()

// check if a team is the preferred one
export const isPreferredTeam = (currentTeam: string): boolean => currentTeam === env('FAVORITE')

// check if one team is the preferred team
export const isPreferredTeamInTeams = (teams: string[]) => teams.includes(env('FAVORITE'))

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

export const probability = (n: number) => {
    return Math.random() < n
}