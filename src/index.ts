import {ElementHandle, chromium, Page} from 'playwright'
import {
    env,
    flipACoin,
    getPreferredGoal,
    getRandomGoal,
    isPreferredTeam,
    isPreferredTeamInTeams, isTieRealistic,
    randomNumberInInterval
} from './helper'
import { config } from 'dotenv'

config()

const TEAM = env('TEAM')
const EMAIL = env('EMAIL')
const PASSWORD = env('PASSWORD')

// TODO all string retrieving functions in one file

const getTeams = async (match: ElementHandle): Promise<string[]> => {
    const team1 = await getTeam(match, '.col1')
    const team2 = await getTeam(match, '.col2')
    return [team1, team2]
}

const getQuotas = async (match: ElementHandle): Promise<number[]> => {
    const quotas = await match.$$('.kicktipp-wettquote')
    return await Promise.all(quotas.map(async (quota) => Number(await quota.innerText())))
}

const getGoals = async (match: ElementHandle): Promise<number[]> => {
    const teams = await getTeams(match)
    const quotas = await getQuotas(match)
    const [quota1, quota2, quota3]= quotas
    // TODO: if text "Spieltag" is in ".prevnextTitle > a" a tie is possible
    const isTiePossible = true
    // removed  && flipACoin from the condition
    if(isTieRealistic(quotas) && isTiePossible && !isPreferredTeamInTeams(teams)) {
        // If a tie is possible, realistic and the randomizer wants one
        const goal = randomNumberInInterval(0, Number(env('TIE_MAX')))
        return [goal, goal]
    } else {
        return [
            getWeightedGoal(quota3, teams, teams[0]),
            getWeightedGoal(quota1, teams, teams[1])
        ]
    }
}

// TODO rename - better idea than weighted?
// TODO more granular?
const getWeightedGoal = (quota: number, teams: string[], currentTeam: string): number => {
    const goal = getPreferredGoal(isPreferredTeam(currentTeam), getRandomGoal(quota))
    // to many goals per match with high quotas so I do some "magic"
    if(goal >= 11) {
        return Math.round(goal / 3) + 2
    }
    if(goal >= 5) {
        return Math.round(goal / 2)
    }
    // if goal is > 1 subtract 1 depending on coin flip, otherwise 0 goals aren't possible
    if(goal >= 1 && flipACoin()) {
        return goal - 1
    }
    // increase the chance of 0 goals
    if(goal === 1 && flipACoin()) {
        return goal - 1
    }
    return goal
}

const getTeam = async (match: ElementHandle, selector: string) => {
    const team = await match.$$(selector)
    return team !== null ? await team[0].innerText() : ''
}

const login = async (page: Page) => {
    await page.fill('#kennung', EMAIL)
    await page.fill('#passwort', PASSWORD)
    await page.click('input[name="submitbutton"]')
}

const bet = async (page: Page) => {
    await page.waitForSelector('text="Tippabgabe"')
    const groupPhaseElement = await page.$$('.prevnextTitle')
    // TODO get text and check if "Spieltag"
    const matches = await page.$$('#tippabgabeSpiele tbody .datarow')
    for await (const match of matches) {
        const [input1, input2] = await match.$$('input[inputmode="numeric"]')
        const goals = await getGoals(match)
        await input1.fill(String(goals[0]))
        await input2.fill(String(goals[1]))
    }
    await page.click('input[name="submitbutton"]')
}

const betPerMatchDay = async (page: Page) => {
    const url = `https://www.kicktipp.de/${TEAM}/tippabgabe?&spieltagIndex=`
    // TODO extend for finals
    const matchDays = [1,2,3,4,5]
    for await (const matchDay of matchDays) {
        await page.goto(url + matchDay)
        await bet(page)
    }
}

(async () => {
    const browser = await chromium.launch({ headless: Boolean(env('HEADLESS')), slowMo: Number(env('SLO_MO')) })
    const context = await browser.newContext({
        locale: env('LANGUAGE'),
    })
    const page = await context.newPage()
    try {
        const url = `https://www.kicktipp.de/${TEAM}/tippabgabe`
        await page.goto(url)
        await login(page)
        await page.click('#accept-choices')
        await betPerMatchDay(page)
        // await browser.close()
        console.log('Browser closed')
    } catch (error) {
        console.log('ERROR: ', error)
        await browser.close()
    }
})()