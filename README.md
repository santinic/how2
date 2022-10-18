# how2: AI for your terminal

how2 finds the simplest way to do something in a unix shell.
It's like `man`, but you can query it in natural language:

https://user-images.githubusercontent.com/179558/196452157-60e6b33a-116d-46f2-a441-7d0696a31452.mp4



# Install
* **With NPM**

    `npm install -g how2`

    if it gives you EACCES errors, [you need to fix npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions). Or you can just use `sudo npm install -g how2` if you don't care.


* **MacOSX (via HowBrew)**

    `brew tap how2terminal/how2`

    `brew install how2`


* **Ubuntu/Debian**

    [Download latest .deb](https://github.com/santinic/how2/releases/latest/how2.deb) and then run:

    `sudo dpkg i how2.deb`

* **Binaries**
    
    [Go to the latest release](https://github.com/santinic/how2/releases/latest) and download the binaries.



# Usage
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

For example, you could alias the proxy settings in your `~/.bash_profile`:

`alias how2="HTTPS_PROXY='your_proxy:8888' how2"`
