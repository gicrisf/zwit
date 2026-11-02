+++
title = "CLI Reference"
description = "Every command and option, with diagnostics and exit status."
draft = false
weight = 30
[extra]
  lead = "Commands, options, error reporting, and exit status."
  toc = true
+++

## Commands {#commands}

| Command                | Meaning                                        |
|------------------------|------------------------------------------------|
| `takumi-render render` | Render one HTML file or standard input to PNG. |
| `takumi-render batch`  | Render a JSON manifest of HTML files.          |


## Render options {#render-options}

| Option                  | Meaning                                                |
|-------------------------|--------------------------------------------------------|
| `--html <FILE>`         | HTML file to read. Defaults to `-` for standard input. |
| `-o`, `--output <FILE>` | PNG file to write. Required.                           |
| `--width <PX>`          | Image width. Defaults to 1200.                         |
| `--height <PX>`         | Image height. Defaults to 630.                         |
| `--fonts-dir <DIR>`     | Font directory. Repeatable.                            |
| `-h`, `--help`          | Print usage.                                           |
| `-V`, `--version`       | Print the version.                                     |


## Batch options {#batch-options}

| Option              | Meaning                                |
|---------------------|----------------------------------------|
| `<MANIFEST>`        | JSON manifest to read. Required.       |
| `--fonts-dir <DIR>` | Additional font directory. Repeatable. |
| `-h`, `--help`      | Print usage.                           |


## Exit status {#exit-status}

The command exits with 0 when every requested render succeeds. It exits with 1 when HTML parsing, font loading, image decoding, rendering, or file I/O fails. Invalid command-line arguments exit with 2 through the argument parser.


## Diagnostics {#diagnostics}

Errors are written to standard error with a `takumi-render:` prefix. Batch mode stops at the first failing card and reports the failing input path.


## Constraints {#constraints}

-   At least one font directory is required.
-   Width and height must be positive integers.
-   Batch inputs and outputs are paths, not globs.
-   The command makes no network requests.
