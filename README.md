# You're fat, stop that.
You're fat, stop that! This is a no nonsense fitness app that will sort you're life out

## Quick start
Open the project and run the following commands in a terminal:
`npm i`
`npm setup`
`npm start`
## Pro Tips

- If you want to up the difficulty, there is a variable called "restAmount" in client/exercise/exercise.mjs. However I have just realised that it will probably break the timer since I hardcoded the css transition. So I'd reccommend keeping it at 10
- On the nav bar you can click your icon on the right to go to your profile
- To test the outside module without actually going outside you can go to Dev Tools -> click the three dot icon on top right -> more tools -> sensors. Then alter the location value. In order to simulate moving.

## WARNING
Since this is not in production, for someone to sign in to my app through google they need to be added as a test user. I've added the following staff accounts:
- `rich.boakes@port.ac.uk`
- `matthew.dennis@port.ac.uk`

Just in case for some reason these accounts don't work. I've also created an account that I have also added. There's no security on it other than the password.
user: `tryingtostopthatimfat@gmail.com`
password: `portsoc123`


## AI usage

I have used copilot throughout this project in order to help identify bugs faster, and quick start development for my pages.

For example if I were to start a new html file I'd ask copilot to make a basic html file for a dashboard, then I'd change it to exactly I what I want

If I was stuck on how to do something, I would usually ask copilot. For example I was not sure how to implement a working map on my page and copilot guided me through setting up the google API in order to do that.

## If I had more time 
- Overwriting functionality of back, forward and refresh buttons on the browser for my SPA portion
- Multiplayer workouts with sockets (one more week and this would have been fully working)
- Calorie burnt tracker
- Was gonna make the app shout insults at you.
- localisation. Wanted to make the page avaliable in another (made up) language for proof of concept
- Would have tried to write my own JWT module
- A way to speed up time to test streaks / daily resets
- Was going to make custom music for the app 
- Would make the app more rude, since that was the point of the app
- Usage of the accelerometer on mobile
- Would implement my own login system to go with oauth.
- Unit testing.
- Community exercise board could have a like / dislike functionality in order to see the good and bad workout routines, could even implement a karma system and users could be able to follow other workout makers
- More advanced css
- Although the app is completely usable on mobile, I could have utilised media queries more to display content in a way more fitting for portrait screens.
# Security Issue, Bugs, non-complete features, what can be improved

- Quite easy to fabricated the completion of exercises, in future this should be handled on the server with timing.
- Naming system for variables and classes are inconsistent at times. Sometimes I join words by camelCase and other I use dashes, this would have been fixed given more time
- Some requests need to be input checked more since it's quite easy to crash the server at the moment.
- More moduarlisation. A lot of my server code is in one file which is not as maintanable as if I had it in multiple files

## ALL ROUTES
```
GET /api/communityworkoutroutines: Retrieves workout routines shared by the community.
GET /api/current_user: Retrieves information about the currently logged-in user.
GET /api/getworkoutroutine/:id: Retrieves a specific workout routine by its ID.
GET /api/leaderboard: Retrieves the leaderboard showing user rankings.
GET /api/profile/:id: Retrieves the profile information of a user specified by their ID.
GET /api/workouts: Retrieves available workout options.
GET /profile/:id: Retrieves the profile of a user specified by their ID.
POST /api/outside-exercise-completion: Handles completion of exercises done outside the app.
POST /api/uploadworkoutroutine: Handles uploading and sharing of custom workout routines.
POST /api/verify: Handles verification processes.
POST /api/workout-completion: Handles completion of workout routines.
```

 
