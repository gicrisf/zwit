+++
title = "Simple Dotfiles Management with GNU Stow"
description = "A practical guide to keeping dotfiles in a Git repository."
authors = ["Giovanni Crisalfi"]
date = 2020-11-20
updated = 2026-11-03
draft = false

[taxonomies]
  tags = ["dotfiles", "stow", "gnu"]
  categories = ["tools"]
+++

“Dotfiles” is short for _dot files_: files whose names begin with a dot. In GNU/Linux, this is how you mark a file as hidden. For those more familiar with Windows, it is a bit like marking a file as “hidden” in its properties, but it is simpler and more elegant.

<!-- more -->

## Why keep your dots

When we talk about dots, we do not mean every “dotted” file on the system, but the ones that live in `$HOME`, `$HOME/.config`, or similar directories, that is, all those files that, like `.bashrc`, keep useful settings for the system.

Just as `.bashrc` contains the shell settings, `.conkyrc` will contain those of Conky (the well-known desktop system monitor), the `.fonts` directory will presumably contain all the additional fonts available to the system, and so on.

Dots mean little to beginners; they are something to bump into, something to puzzle over when fixing that one problem. Over time you grow attached to your own solutions, you learn to manage these files with more confidence, you make choices you regret, and the dots become the containers of your virtual domestic comfort. On unfamiliar systems you feel uncomfortable, you do not recognise the keyboard shortcuts, you do not feel at home with desktop environments far from your usual one, and although it is good to change from time to time, it is essential to preserve your home and your history.

Feuerbach said that we are what we eat, meaning the deep link between us and matter, the chemistry of our organism. For a person whose corporeality often moves into the virtuality of a desktop environment, it is probably fair to say that we are what we dot. Dots say a lot about us: are we more baroque or more minimalist? In what environment do we write code? Do we actually write it? At night, during the day? Which palette do we prefer? Do we use the keyboard as a complement to the mouse, or do we never want to leave the keys? All of this and much more emerges from our dots.

## GNU Stow

Before moving all your dots into a repository and then going mad over hand-made, hand-managed symlinks, here is the solution: it is called GNU Stow ([link to the manual](https://www.gnu.org/software/stow/manual/stow.html)).

### What does Stow do?

It takes the files contained in its directories and automatically creates symlinks in the home directory, trying to generate as few symlinks as possible: for example, if it can choose between creating a single symlink for a directory and creating all the symlinks of the files contained in it, Stow will always choose the first option. Fewer symlinks, fewer chances of making a mess.

## An example

Suppose your home directory looks like this:

```mermaid
---
config:
  treeView:
    showIcons: true
---
treeView-beta
    home/
        brandon/
            .config/ ## per-application settings
                uzbl/ ## browser configuration
                    ...
            .local/ ## user data
                share/
                    uzbl/
                        ...
            .vim/ ## Vim runtime files
                ...
            .bashrc :::highlight icon(logos:bash) ## shell startup
            .bash_profile ## login shell
            .bash_logout ## shell cleanup
            .vimrc icon(logos:vim) ## Vim configuration
```

What can we do to manage all these files?
We take them and move them into a directory called `dotfiles`:

```mermaid
---
config:
  treeView:
    showIcons: true
---
treeView-beta
    home/
        brandon/
            .config/ ## remaining configuration
            .local/ ## remaining user data
                share/
            dotfiles/ :::highlight ## Stow package root
                bash/ ## shell package
                    .bashrc icon(logos:bash) ## shell entry point
                    .bash_profile
                    .bash_logout
                uzbl/ ## browser package
                    .config/
                        uzbl/
                            ...
                    .local/
                        share/
                            uzbl/
                                ...
                vim/ ## editor package
                    .vim/
                        ...
                    .vimrc icon(logos:vim) ## Vim configuration
```

But now we are left without the dots where we need them!
That problem is solved with a few commands.

## Installing Stow

This depends on the operating system.

- Ubuntu? `sudo apt-get install stow`;
- Fedora? `sudo dnf install stow`;
- Arch? Manjaro? `sudo pacman -S stow`.

And so on: quite predictably, Stow is called “stow” in all the main repositories, if not in every repository. You can also [clone it from source](https://savannah.gnu.org/git/?group=stow) and build it yourself.

## Using Stow

Let's go back to the home directory from earlier. We have moved some files into the `dotfiles` directory. Let's enter it.

```bash
$ cd ~/dotfiles
```

Now we run Stow to generate the symlinks in the home directory. First, the symlinks for all files in the `bash` directory:

```bash
$ stow bash
```

Then those contained in `uzbl` and `vim`:

```bash
$ stow uzbl
$ stow vim
```

What did we get? A situation functionally identical to the initial one.

> N.B. If a directory you run `stow` on contains another directory, Stow links the containing directory itself rather than each file inside it.

Does something not add up? No problem, just try it. In the worst case, undo the previous command by adding the `-D` option. Example:

```bash
$ stow -D uzbl
```

There is no danger: Stow will never delete anything it did not create in the first place.

## Other commands

Create symlinks for all files contained in a directory recursively:

```bash
$ stow --target=[path/to/target_directory] [file1 directory1 file2 directory2]
```

Undo the previous operation:

```bash
$ stow --delete --target=[path/to/target_directory] [file1 directory1 file2 directory2]
```

Run a simulation to see what the result would be:

```bash
$ stow --simulate --target=[path/to/target_directory] [file1 directory1 file2 directory2]
```

Exclude files matching a regular expression:

```bash
$ stow --ignore=[regex] --target=[path/to/target_directory] [file1 directory1 file2 directory2]
```

I hope all of this can be useful to someone. Happy dotmaking.
