# NAME
how2 - AI for your terminal

# SYNOPSIS
**how2** [-s] query expressed in natural language

# DESCRIPTION
how2 helps you with finding the right commands on your Bash journey.
By default, how2 translates a natural language description into Bash commands (uses an external AI API call to how2terminal.com). If this fails, it tries to search StackOverflow. You can skip the API call by using the option -s (goes straight into StackOverflow search).

# EXAMPLES
how2 decompress tar.gz file

how2 list installed apt packages by size

how2 watch a file while is changing -s


# OPTIONS
**-s** Search with StackOverflow, without trying AI mode first.

**--set-token** Sets the token (in ~/how2.json) for any future API call.
**--get-token** Prints the current tokan (from ~/how2.json)

# AUTHOR
Claudio Santini, https://how2terminal.com
