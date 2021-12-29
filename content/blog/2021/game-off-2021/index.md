---
title: Game Off 2021 Part I
date: '2021-10-23T16:35:44+07:00'
description: ''
resources:
  - params:
    process: false
    src: hero.png
    title: Game Off 2021
tags:
  - game-off
  - javascript
  - projects
  - planning
---

[Game Off 2021](https://itch.io/jam/game-off-2021) is this years iteration of a regular game development contest hosted by [itch.io](https://itch.io).

I decided a while back to develop some form of program or game just because I can. This is the perfect opportunity to force myself to do so and I'll program a little game throughout the month of November. If it fits the Game Off rules I might enter it into the contest. I don't expect to win or even be in the upper ranks, there are plenty of dedicated game developers out there that deserve their work being recognised.

I'll report each Sunday if I got anywhere and what the progress of the project is and go into depth about that. [Feel free to follow](/tags/game-off/) :)

My current state is an empty repository (this is where everything starts, isn't it?) and a faint idea.

The idea is the following: A simple click-click puzzle. Tiles of a graphic (world/level) can be clicked and rotate on click. With enough clicks of enough tiles a path from A to B is created on the graphic and a subject can move to B. Constraints to this might be interactive or property based constraints like the following:

- level timeout
- maximum allowed click count per level
- diagonal, horizontal or vertical tiles turn counter to the current clicked tile,
- tiles dis- and reappear on certain clicks
- tiles dis- and reappear based on timeout or move count
- enemies trapping/freezing/killing the subject
- power ups and power downs (for counters and clicks)

The technology stack will be HTML5 with JavaScript as a browser game, for now. I need to research if there is a viable way to transform a browser game onto other platforms.

That's all for now. Let's wait and see what the requirements of the contest are.
