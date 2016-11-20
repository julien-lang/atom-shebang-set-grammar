# shebang-set-grammar Atom package

shebang-set-grammar is a package for [Atom](https://atom.io/) that auto-detect the files' grammar from the [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)).

When opening a file with Atom, let's say a Python file for instance, Atom automaticaly set the Python grammar (syntax highlighting). This is done by looking at the file extension ".py". Atom knows that a .py extension means Python. ".sh" => shell, ".php" => PHP, ".js" => Java script...

But, as a Unix user, I often write scripts without defining the script language in the file extention. I prefer to make the file executable and define how to execute it in the shebang:

* bash

         #! /bin/bash

* perl

        #! /bin/perl -W

* python

        #! /usr/bin/env python

In that case, when Atom open this file, the grammar is not detected. I can define it manually in Atom but I would prefer if it would be done automaticaly by reading the shebang.

This is what this module is doing!

## Process description

* straightforward

          #! /usr/bin/python     =>     python     =>     set-grammar(source.python)


* extra arguments

          #! /usr/bin/python -a -b -c      =>      python     =>     set-grammar(source.python)


* wrapper programm

          #! /usr/bin/env python -a -b      =>     python     =>     set-grammar(source.python)

* aliases - when binary is different from Atom's grammar name

          #! /bin/sh      =>      sh      =(alias)=>     shell      => set-grammar(source.shell)

          #! /bin/bash      =>      bash      =(alias)=>     shell       => set-grammar(source.shell)
