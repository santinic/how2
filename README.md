# how2: AI for your Terminal


how2 finds the simplest way to do something in a unix shell.
It's like `man`, but you can query it in natural language. It uses a mix of AI code-completion and StackOverflow search.

It effectively replaces `Chrome => New Tab => Google => Click first result on StackOverflow => Scroll Down to first answer.`

*Work in progress 🚧 🚧 🚧 Updates coming soon*

https://user-images.githubusercontent.com/179558/196452157-60e6b33a-116d-46f2-a441-7d0696a31452.mp4


# Install
* **With NPM:**

    `npm install -g how2`

    if it gives you EACCES errors, [you need to fix npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions). Or you can just use `sudo npm install -g how2` if you don't care.


* **MacOSX (via HowBrew):**

    `brew tap how2terminal/how2`

    `brew install how2`


* **Ubuntu/Debian:**

    [Download latest .deb](https://github.com/santinic/how2/releases/latest/how2.deb) and then run:

    `sudo dpkg i how2.deb`

* **Binaries:**
    
    [Go to the latest release](https://github.com/santinic/how2/releases/latest) and download the binaries.



# Usage
By default, how2 uses an external AI server to find the best unix command line suggestion.

![how2 unzip bz2](https://raw.githubusercontent.com/santinic/how2/master/img/ai.png)

If you add the `-s` option instead, it will search StackOverflow for an answer. 
If you have exhausted your daily AI quota (it goes by IP) it defaults to StackOverflow search.

![how2 unzip bz2](https://raw.githubusercontent.com/santinic/how2/master/img/s.png)

After that you can press SPACE to go to the interactive mode, where you can choose a different stackoverflow question/answer.

![how2 interactive mode](https://raw.githubusercontent.com/santinic/how2/master/img/interactive.png)

![how2 interactive mode 2](https://raw.githubusercontent.com/santinic/how2/master/img/interactive2.png)


[//]: # (You can use `-l lang` to find answers for other languages:)
[//]: # (![-l python]&#40;https://raw.githubusercontent.com/santinic/how2/master/img/python.png&#41;)


## How does it work?
Behind the curtain, the API use a couple of AI code-completion models (Salesforce CodeGen) 
retrained on Bash/Powershell commands.
This is just the beginning, 
[we are looking for funding](https://how2terminal.com/invest) to build a much bigger thing.
Currently, the AI mode is free for everybody: max 5 requests per day, 10 req / minute.
If you are a professional user [consider upgrading to a paid subscription](https://how2terminal.com/pricing).


## How well does it work?
How2 is surprisingly useful once you get used to it. 
I have added it to our dev laptops
and Linux servers, and it keeps saving me time.
Sometimes, the model cannot find a solution and will result in unexpected output. 
In that case, We suggest rewording your input, it often takes minor changes to get to a good solution.
And, if it really doesn't work, just add `-s` to get the best result on StackOverflow straight into
your Terminal.


## Copy-Paste with mouse
When you are in "interactive mode" (after you press SPACE), if you want to copy-paste more than one line you can use block-select:

**With Ubuntu try holding `Ctrl+Alt` before you select, or `Alt+Cmd` if you're in iTerm on Mac.**

(thanks to @danielkop for this suggestion).

## Can i use it behind Proxy ?
Yes, you need to use `HTTP_PROXY` or `HTTPS_PROXY` environment variables.

For example, you could alias the proxy settings in your `~/.bash_profile`:

`alias how2="HTTPS_PROXY='your_proxy:8888' how2"`
