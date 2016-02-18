# howto
Howto uses Google and Stackoverflow to find the simplest way to do something on
a unix bash command line.

``` bash
$ howto read file while is changing
-> tail -f filename
```

# install
`npm install -g howto`

# usage
You can also specify a language
``` bash
$ howto -l python sort list
-> sorted(list)
```
If you don't specify a language it defaults to Bash unix command line:
``` bash
$ howto decompress tar.gz
-> tar xvzf file.tar.gz
```

# How does it works ?
Uses Google and Stackoverflow APIs, because Stackoverflow search doesn't
works as well.
