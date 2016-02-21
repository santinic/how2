# how2

![Demo of using how2](https://raw.githubusercontent.com/santinic/how2/master/img/demo.gif)

how2 finds the simplest way to do something on a unix bash command line.
It's like `man`, but it gives you exactly what you are looking for.

```
$ how2 read file while is changing

terminal - Output file contents while they change
=================================================

You can use tail command with -f  :

   tail -f /var/log/syslog

It's good solution for real time  show.
```


## Install
To install, run this command:

`npm install -g how2`

If you don't have npm, then [just install NodeJS](https://nodejs.org), it takes two seconds.


## Usage
If you don't specify a language **it defaults to Bash** unix command line.
To specify a language, use ```-l```

```
$ how2 -l python permutations of a list

algorithm - How to generate all permutations of a list in Python ...
====================================================================

In Python 2.6 (http://docs.python.org/dev/whatsnew/2.6.html) onwards:

   import itertools
   itertools.permutations([1,2,3])

(returned as a generator.  Use list(permutations(l)) to return as a list.)

Press SPACE for more choices, any other key to quit.
```

## How does it work ?
Uses Google and Stackoverflow APIs, because Stackoverflow search on its own doesn't
works as well.


## Why ?
Because I can never remember how to do certain things. And reading man pages always takes too long.

![XKCD](http://imgs.xkcd.com/comics/tar.png)


## TODO
* Add automatic copy/paste from -i to command line
