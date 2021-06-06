# betBot for [kicktipp.de](https://www.kicktipp.de/)

> Automate your bets on kicktipp.de for the European Championship based on betting odds - should also work on every other mode on this platform.

Status: It runs and works for now, but I'm not happy with the structure :)

## Why do you need this?

I'm a handball fan, but I like to bet with my friends. I also know myself, and I know that I would forget to bet one day and then my chances to win are near zero. And if that I have at least a bet on each match during the group phase.

## How does it work?

[Kicktipp.de](https://www.kicktipp.de/) provides betting odds from third party providers. This little program takes the odds and transform them into goals. Everything with a little random factor. Every run should look a little bit different as the one before. It also won't look the same as you can define your favorite team and even how much bonus goals it gets. Of course you could do some fancy machine learning stuff, and I would love to see it and especially compare both concepts.

## How to use?

1. Check that you have the right Node.js version - [install Node.js](https://nodejs.org/en/download/).
```bash
node -v # you 14 or newer
```
2. Download or clone (if you need what cloning means you won't need a step by step guide) this repository.

![Download coding](docu/download.png)
   
3. Rename `sample.env` to `.env`.
4. Add your [kicktipp.de](https://www.kicktipp.de/) credentials:
    - TEAM - you find it in the URL `https://www.kicktipp.de/handball/tippabgabe` -> **handball**
    - EMAIL
    - PASSWORD
5. Run `npm install` in your terminal - run this after each update.
6. Run `npm run dev` in your terminal - every time you want to set your goals.
7. Enjoy the show and win the game! :)

PS: This bot doesn't do the bonus bets! Don't forget them!!

## Open topics / ideas

> Feel free to create PRs for one of the following topics. Or do you even have other ideas? -> [Issue](https://github.com/LukaHarambasic/betBot/issues)

- [ ] Future proof for final rounds - currently only the group phase is working
- [ ] Dockerfile
- [ ] Publish to dockerhub
- [ ] Find one click deploy solution
- [ ] Add tests
- [ ] Check for typos
- [ ] Restructure the project
- [ ] ML solution