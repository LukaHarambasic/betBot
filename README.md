# betBot for kicktipp

## Why?

I'm a handball fan, but I like to bet with my friends. I also know myself, and I know that I would forget to bet one day and then my chances to win are near zero. And if that I have at least a bet on each match during the group phase.

## Open topics / ideas

- [ ] Future proof for final rounds - currently only the group phase is working
- [ ] Dockerfile
- [ ] Publish to dockerhub
- [ ] Find one click deploy solution
- [ ] Add tests

## How to use

1. Check that you have the right node version:
```bash
node -v # you 14 or newer
```
2. Download or clone this repository.
![Download coding](docu/download.png)
   
3. Rename `sample.env` to `.env`.
4. Add your kicktipp.de credentials:
    - TEAM - you find it in the URL `https://www.kicktipp.de/handball/tippabgabe` -> **handball**
    - EMAIL
    - PASSWORD
5. Run `npm install` in your terminal - run this after each update.
6. Run `npm run start` in your terminal - every time you want to get your goals.
7. Enjoy and win! :)

PS: This bot doesn't do the bonus bets! Don't forget them!!
