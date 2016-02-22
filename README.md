# how2: stackoverflow from the terminal

how2 finds the simplest way to do something in a unix shell.
It's like `man`, but you can query it in natural language:

![Demo of using how2](https://raw.githubusercontent.com/santinic/how2/master/img/demo.gif)


## Install
You can install it via npm:

`npm install -g how2`

if it gives you EACCES errors, [you need to fix npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions). Or you can just use `sudo npm install -g how2` if you don't care.

#### If you don't have npm:
Then [just install NodeJS](https://nodejs.org):
- On Ubuntu try with ```sudo apt-get install nodejs npm```
- On Mac ```brew install node```


## Usage
If you don't specify a language **it defaults to Bash** unix command line.
how2 tries to give you immediately the most likely answer:

![how2 unzip bz2](https://raw.githubusercontent.com/santinic/how2/master/img/bz2.png)

After that you can press SPACE to go to the interactive mode, where you can choose a different stackoverflow question/answer.

![how2 interactive mode](https://raw.githubusercontent.com/santinic/how2/master/img/interactive.png)

![how2 interactive mode 2](https://raw.githubusercontent.com/santinic/how2/master/img/interactive2.png)


With ```-l``` you can also find answers for other languages:

![-l python](https://raw.githubusercontent.com/santinic/how2/master/img/python.png)


## How does it work ?
It uses Google and Stackoverflow APIs, because Stackoverflow search on its own doesn't
works as well.


## Why ?
Because I can never remember how to do certain things. And reading man pages always takes too long.

![XKCD](http://imgs.xkcd.com/comics/tar.png)


## TODO
* Add automatic copy/paste from -i to command line
