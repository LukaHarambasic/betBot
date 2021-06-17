import {ElementHandle, chromium, Page} from 'playwright'
import {
    env,
    isPreferredTeam,
    isPreferredTeamInTeams, isTieRealistic, probability,
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

const getOdds = async (match: ElementHandle): Promise<number[]> => {
    const odds = await match.$$('.kicktipp-wettquote')
    return await Promise.all(odds.map(async (odd) => {
        const oddValue = Number(await odd.innerText())
        return Math.sqrt(oddValue)
    }))
}

const getGoals = async (match: ElementHandle): Promise<number[]> => {
    const teams = await getTeams(match)
    console.log('teams', teams)
    const odds = await getOdds(match)
    if(odds.length === 0) {
        return []
    }
    // TODO: depends on the rules if ties are possible in the ko matches
    const isTiePossible = true
    if(isTieRealistic(odds) && isTiePossible && !isPreferredTeamInTeams(teams)) {
        // If a tie is possible, realistic and the randomizer wants one
        const goal = Math.round(Math.sqrt(odds[1]))
        return [goal, goal]
    } else {
        return [
            getWeightedGoal(odds[2], teams, teams[0]),
            getWeightedGoal(odds[0], teams, teams[1])
        ]
    }
}

const getWeightedGoal = (odd: number, teams: string[], currentTeam: string): number => {
    const bonus = Number(env('FAVORITE_BONUS'))
    const goal = isPreferredTeam(currentTeam) ? (Math.round(odd) + bonus) : Math.round(odd)
    if(goal >= 1 && probability(0.2)) {
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
    const groupPhaseElement = await page.$$('.prevnextTitle')
    const matches = await page.$$('#tippabgabeSpiele tbody .datarow')
    let hasTobeSubmitted = false
    for await (const match of matches) {
        const [input1, input2] = await match.$$('input[inputmode="numeric"]')
        const goals = await getGoals(match)
        const isFinished = input1 === undefined && input2 === undefined // you cant bet on finished matches - finished = no input field
        const hasOdds = goals.length > 0 // you cant bet on matches where there arent odds - no goals = no odds
        console.log('goals', goals)
        if (!isFinished && hasOdds) {
            await input1.fill(String(goals[0]))
            await input2.fill(String(goals[1]))
            hasTobeSubmitted = true
        }
    }
    if(hasTobeSubmitted) {
        await page.click('input[name="submitbutton"]')
    }
}

const betPerMatchDay = async (page: Page) => {
    const url = `https://www.kicktipp.de/${TEAM}/tippabgabe?&spieltagIndex=`
    // TODO extend for finals
    const matchDays = [1,2,3,4,5,6,7,8,9,10]
    for await (const matchDay of matchDays) {
        await page.goto(url + matchDay)
        await bet(page)
    }
}

(async () => {
    const isHeadless = Boolean(JSON.parse(env('HEADLESS')))
    const browser = await chromium.launch({ headless: isHeadless, slowMo: Number(env('SLO_MO')) })
    const context = await browser.newContext({
        locale: env('LANGUAGE'),
    })
    const page = await context.newPage()
    try {
        const url = `https://www.kicktipp.de/${TEAM}/tippabgabe`
        await page.goto(url)
        await login(page)
        const acceptCookies = await page.$$('#accept-choices')
        if(acceptCookies) {
            await page.click('#accept-choices')
        }
        await betPerMatchDay(page)
        // await browser.close()
        // console.log('Browser closed')
    } catch (error) {
        console.log('ERROR: ', error)
        await browser.close()
    }
})()
