## Inspiration

We started off with one goal: to build an app that was super fun to use, and enables people to connect with each others in a novel way! This goal got us thinking about the apps and games that have the mechanic of bringing users back on a daily interval. Examples of this include BeReal, which asks users to upload a picture within 2 minutes of a notification every day, and Wordle, a word game where the guess word resets every day. This mechanic reduces the friction to return and update your friends.

Another thing we thought about is what people enjoyed doing online. One thing that was  univerally loved was [skribbl.io](skribbl.io), an online drawing game. Thus, we decided to center our app around doodling!

## What it does

Every day, the app has a new prompt for all users to draw. When you open the app and press "start", the prompt is revealed and you get 30 seconds to draw it! Once the time is up, the doodle is automatically uploaded and shared with friends (and the world)!

In the Gallery page, you can view and "heart" doodles from others. You swipe through the doodles in an interface akin to Tiktok or flashcards. 

In the Live page, you can view a live-updating stream of doodles submitted from around the world!

## How we built it

We needed reactive components that can easily update as the database updates, as well as the ability to easily write and deploy a full-stack app. Thus, Convex was a perfect fit! On the frontend, we used React with Vite, and its deployment was done via Vercel.

In addition, we mocked up designs with Figma, which helped greatly with establishing a good-looking, consistent design for the website.

## Challenges we ran into

Some of our features, such as Gallery, required interacting with beta features on Convex, notably paginated queries. We encountered several bugs and discrepancies between the documentation and the implemented library. The Convex team has been extremely helpful for getting this app online, and we could not have made this without them!

Another large challenge was building the frontend to be responsive and work well across different screen sizes and modes of interaction (mouse vs touch). For much of us, it was the first time working on things at this level of difficulty on the frontend side.

However, the biggest challenge we faced was the fact that someone we planned on partnering with, who we relied on to have frontend development experience, actually found out he got his application rejected when he tried to enter on Saturday! This put a wrench in our gears, but fortunately we were able to quickly find Rahul, who was looking for a group to join, and he was able to help us with the frontend code.

## Accomplishments that we're proud of

The fact that it actually works is something of a big feat already, and we are very very proud of that!

We were working with a lot of technologies we were unfamiliar with, such as Convex, React, and CSS. Any one of the parts failing would mean that our project would not work at all. Somehow, we managed to get all of the different moving parts to work and work together!
x
We are especially proud of how the app looks! The design went through many iterations, and none of us have much experience in UI/UX design. Moreover, we managed to implement the design, barring some non-essential aesthetic features, completely in React.

## What we learned

We all learned a lot about frontend development, UI/UX design, and working with the Convex library.

But more importantly, this was the first time we competed in a hackathon for two of us, and we learned that they are a lot of fun! Getting the entire hackathon experience was very worthwhile, despite the headaches and the sleep deprivation.

## What's next for Prompt

Many other hackers we talked to said they would actually use this app if it were to actually be published, which is awesome. We hope to polish this app up (add security, design for scalability, incorporate more features) and deploy it to the world soon!