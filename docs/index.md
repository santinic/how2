---
title: how2 - stackoverflow from the terminal
---
# how2: stackoverflow from the terminal

ow2 finds the simplest way to do something in a unix shell.
It's like `man`, but you can query it in natural language:

![Demo of using how2](https://raw.githubusercontent.com/santinic/how2/master/img/demo.gif)

## Install
You can install it via npm:

`npm install -g how2`

if it gives you EACCES errors, [you need to fix npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions). Or you can just use `sudo npm install -g how2` if you don't care.

#### If you don't have npm
Then [just install NodeJS](https://nodejs.org).

#### On Ubuntu
Install node: `sudo apt-get install nodejs npm`

Make a symlink: `ln -s /usr/bin/nodejs /usr/bin/node`

Then install how2: `npm install -g how2`

#### On Mac
Install node with brew: `brew install node`.

If you don't have brew, [download nodejs from here](https://nodejs.org)

Then install how2: `npm install -g how2`

#### If you get "/usr/bin/env: node: No such file or directory"
Your Linux distro (like Ubuntu) probably uses "nodejs" instead of "node".

Make a symlink and it should work:
```ln -s /usr/bin/nodejs /usr/bin/node```

## Usage
If you don't specify a language **it defaults to Bash** unix command line.
how2 tries to give you immediately the most likely answer:

![how2 unzip bz2](https://raw.githubusercontent.com/santinic/how2/master/img/bz2.png)

After that you can press SPACE to go to the interactive mode, where you can choose a different stackoverflow question/answer.

![how2 interactive mode](https://raw.githubusercontent.com/santinic/how2/master/img/interactive.png)

![how2 interactive mode 2](https://raw.githubusercontent.com/santinic/how2/master/img/interactive2.png)


You can use `-l lang` to find answers for other languages:

![-l python](https://raw.githubusercontent.com/santinic/how2/master/img/python.png)

## Copy-Paste with mouse
When you are in "interactive mode" (after you press SPACE), if you want to copy-paste more than one line you can use block-select:

**With Ubuntu try holding `Ctrl+Alt` before you select, or `Alt+Cmd` if you're in iTerm on Mac.**

(thanks to @danielkop for this suggestion).

## Can i use it behind Proxy ?
Yes, you need to use `HTTP_PROXY` or `HTTPS_PROXY` environment variables.

For example, you could alias the proxy seetings in your `~/.bash_profile`:

`alias how2="HTTPS_PROXY='your_proxy:8888' how2"`

## How does it work?
It uses Google and Stackoverflow APIs, because Stackoverflow search on its own doesn't
works as well.


## Why?
Because I can never remember how to do certain things. And reading man pages always takes too long.

![XKCD](http://imgs.xkcd.com/comics/tar.png)

Taken from https://xkcd.com/1168/


## TODO
* Add automatic copy/paste from -i to command line
