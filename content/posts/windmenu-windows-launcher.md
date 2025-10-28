+++
title = "Windmenu: A Minimalist Windows Launcher"
author = ["Giovanni Crisalfi"]
date = 2025-10-28
draft = false
[taxonomies]
  tags = ["rust", "clang", "windows"]
  categories = ["projects"]
+++

I've spent years bouncing between different operating systems, and I always found a pillar in dmenu's simplicity and portability. That minimal, keyboard-driven launcher that lets you summon any application without touching the mouse. I wanted something like that on Windows too.

<!-- more -->

## On Launchers

<!-- Could create the image in dither -->
An operating system should be an extension of volition: you think of a program, a fragment of data, and it manifests in the fewest steps possible, with the least amount of latency possible. It should aspire to be like a mental glove that transduces intent into execution, orchestrating a rhizome of tapered mechanical fingers in digital space.

When you approach the keyboard, you already know what you want to run: a browser, a text editor, a music player. Running a program is the very first action you take. On Linux desktops, this immediacy is understood, and not just in minimalist tiling window managers for power users, but in mainstream environments too.

<!-- https://linuxiac.com/gnome-40-released-with-redesigned-activities-overview/ -->
![GNOME 40 Activities Overview on login](/img/gnome40-1.png)

KDE demonstrates this perfectly: while offering comprehensive mouse-driven interaction, it also provides [KRunner](https://userbase.kde.org/Plasma/Krunner), a keyboard-driven launcher so smooth I wouldn't even need dmenu there. GNOME, on the other hand, pursues an even deeper level of immediacy, since it [drops you straight into the activities overview when you login into the system](https://discourse.gnome.org/t/gnome-40-login-is-to-the-activities-overview-mode-how-do-you-disable-this/5783). Clean, direct.

But the built-in Windows search? It's a mess. Microsoft has been [incorporating React Native into Windows 11](https://devblogs.microsoft.com/react-native/rnw-settings-win11/) for parts of the Settings app and Start Menu. They're spinning up a JavaScript runtime and rendering engine for system UI components. On first launch in a session, if your CPU is busy, it visibly lags. The previous menu weren't perfect, but they were lighter on system resources. The new one loads ads, web results, and "helpful" suggestions you never asked for, all while consuming CPU cycles that could be doing actual work. And if you don't disable web search, it lags whenever you search for anything - doesn't matter how powerful your machine is, doesn't matter the state of the CPU.[^1]

Someone might say:

> Computers are powerful nowadays, you can't even notice that!

Wrong. You can notice, and that line of thinking is why we have paradoxically less performant commercial OS than 30 years ago.

My own ritual, for example, usually begins with Emacs; when I'm on Windows, this means running the GUI version through WSL-1 and a X server. I didn't want to open a terminal emulator to launch a GUI: a hotkey, some typing, done. That's how it should be. [^2]

This specific need actually drove the whole custom command system. If a launcher couldn't handle arbitrary commands, it couldn't solve my problem; and that's what I wanted to achieve on Windows: to transplant the actual dmenu philosophy - a rectangle with text, high contrast, no translucent blur effects, no fade animations, no compositing - just a well-contrasted surface with program names that appears instantly when you press the hotkey.

There are third-party launchers for Windows already: PowerToys Run has beautiful UI, but beauty wasn't the point. I wanted minimalism: do one thing (launch programs or scripts), do it well, do it fast. This meant building with pure Win32 APIs. No frameworks, no rendering engines, no external UI libraries. Something lean enough it could theoretically run on Windows 3.1.

## Win32 UI

I started from the UI. Creating windows, rendering text, drawing rectangles, managing keyboard input. It worked, but it was non-trivial and painful to do in Rust with a lot of unsafe calls. Then I found [wlines](https://github.com/JerwuQu/wlines) by JerwuQu: a dmenu-like launcher for Windows, written in pure C with only Win32 APIs. Exactly what I wanted.

This reframed the problem. Instead of building a monolithic launcher, I could split it into two pieces:

- **Application launcher** (windmenu): Discovers programs, handles hotkeys, manages execution
- **Generic selector** (wlines): Displays items, handles navigation, returns selection

Windmenu's job became clear: organize input for wlines (the list of available programs) and manage the output (execute the selected program).

## Wlines as Subprocess

The initial implementation was straightforward. Windmenu would build a command-line invocation of wlines with all the menu items and configuration flags, spawn it as a subprocess, and read the selected item from stdout:

```rust
// Simplified version of the original approach
use std::process::{Command, Stdio};

let child = Command::new("wlines.exe")
    .args(&["-sbg", "#285577", "-sfg", "#ffffff", "-p", "Select option:"])
    .stdin(Stdio::piped())
    .stdout(Stdio::piped())
    .spawn()?;

if let Some(mut stdin) = child.stdin {
    stdin.write_all(b"Option 1\nOption 2\nOption 3")?;
}

let output = child.wait_with_output()?;
let selection = std::str::from_utf8(&output.stdout)?;
```

This worked. It was performant on my development machine. But on older machines with mechanical drives, or systems under load, the lag was noticeable. The bottleneck was the process creation overhead. Every time you pressed the hotkey:
1. Windows had to create a new process
2. Load the wlines executable from disk
3. Initialize the UI subsystem
4. Parse all the command-line arguments
5. Render the window

Steps 1-4 happened every single time, even though the executable and most of the state never changed.

## Forking Wlines

The solution was simple in concept: don't restart wlines every time. Keep it running as a background process (like a unix daemon) and communicate with it via named pipes. Instead of spawning a subprocess, windmenu opens a connection to `\\.\pipe\wlines_pipe` and sends the menu items directly to the already-initialized wlines daemon:

```rust
// Current daemon-based approach (simplified)
let pipe = OpenFileW(
    to_wide_string("\\\\.\\pipe\\wlines_pipe").as_ptr(),
    GENERIC_WRITE,
    0,
    // ... flags
);

WriteFile(pipe, items.as_bytes(), ...);
```

The daemon is already running, already has its window hidden and ready, already has fonts loaded. When the command arrives, it just shows the window and renders the items.

This approach required forking wlines. The original was designed as a one-shot command-line tool: like dmenu, it configured everything via command-line arguments. I extended it to:
- Run as a background process
- Listen on a named pipe for commands
- Keep the window hidden until needed
- Read configuration from a text file
- Support vim keybindings (`hjkl` navigation)

The fork lives at [github.com/gicrisf/wlines](https://github.com/gicrisf/wlines). Still pure C, which makes sense for this kind of low-level UI work.

My fork can compile as either a daemon or a traditional one-shot binary. Windmenu supports both modes: it prefers the daemon method (faster), but if the daemon isn't running and you've configured `wlines_cli_path` in `windmenu.toml`, it falls back to the subprocess approach. Use the fast daemon setup normally, keep the traditional method as fallback, or use it exclusively if you prefer. The architecture doesn't force you into one approach.

## Two-Daemon Architecture

The two-daemon architecture wasn't just about performance. It was about preserving dmenu's fundamental philosophy: a generic, reusable selector interface. On Linux, dmenu is not locked to launching applications. You can pipe anything to it: password manager entries, file search results, window manager commands, music playlists. It's a moldable interface that displays input and returns selection, while bash scripts handle the actual logic.

On Windows, this approach isn't as straightforward. You could pair AutoHotkey with PowerShell scripts, but AutoHotkey requires administrator permissions for certain operations. Since I needed an active process to capture hotkeys anyway, it made sense to build something more integrated: a dedicated daemon that handles application discovery, configuration, and custom commands.

The split:

**wlines-daemon.exe**: Generic selector
- Displays items, handles navigation
- Returns selection
- Doesn't care what you're selecting

**windmenu.exe**: Application launcher (one use case)
- Monitors for hotkeys
- Discovers applications (Start Menu, Windows Store apps)
- Sends program list to wlines-daemon
- Executes the selected program

They communicate via named pipes (`\\.\pipe\wlines_pipe`). External scripts can still access wlines directly, but windmenu makes it easier: bind PowerShell scripts to custom commands in the TOML config. For example, you can run WSL commands:

```toml
# Execute commands in WSL
[[commands]]
name = "WSL: Update packages"
args = ["wsl", "-e", "bash", "-c", "sudo apt update && sudo apt upgrade"]

# Open WSL home directory
[[commands]]
name = "WSL Home"
args = ["wsl", "-e", "bash", "-c", "cd ~ && exec bash"]
```

...or execute PowerShell snippets:

```toml
# Run a beep using PowerShell
[[commands]]
name = "Beep"
args = ["powershell", "-Command", "[Console]::Beep(440, 500)"]
```

Managing both daemons required a unified interface. I built a `Daemon` trait with separate implementations for `WindmenuDaemon` and `WlinesDaemon`:

```rust
pub trait Daemon {
    fn get_process_name(&self) -> &str;
    fn start(&self) -> Result<(), DaemonError>;
    fn stop(&self) -> Result<(), DaemonError>;
    fn restart(&self) -> Result<(), DaemonError>;
    fn get_status(&self) -> DaemonStatus;
    // Startup method management...
}
```

This trait-based approach made the CLI natural to implement: `windmenu daemon all restart` controls both, `windmenu daemon wlines restart` controls just wlines. The code mirrors the command structure (which was deliberate, because I modeled the entire interface after systemd).

## Systemd-Inspired CLI

I needed to manage two daemons (windmenu and wlines) with complete lifecycle control: start, stop, restart, status checking, startup configuration. Windows Services require administrator privileges to install and manage, making deployment friction-heavy. I wanted Windmenu to work in restricted corporate environments where users can't install system services.

So I built a daemon manager into the CLI itself, taking inspiration from the best daemon manager I knew: systemd.

```bash
windmenu daemon self start
windmenu daemon self status
```

The pattern is consistent: `windmenu daemon <target> <action>`. The target can be `self` (windmenu daemon), `wlines` (wlines daemon), or `all` (both daemons). The actions mirror systemd's verbs:

```bash
# Start both daemons
windmenu daemon all start

# Restart just wlines
windmenu daemon wlines restart

# Check status of everything
windmenu daemon all status
```

This CLI design made the code architecture cleaner too. The `Daemon` trait I mentioned earlier emerged directly from thinking about what operations systemd exposes. If systemd needs `start`, `stop`, `restart`, `status`, and `enable`/`disable` for any service, then my `Daemon` trait should provide the same operations for any daemon.

The implementation uses Clap's derive macros for argument parsing, which generates help text automatically:

```rust
#[derive(Parser)]
enum Commands {
    Daemon {
        #[command(subcommand)]
        daemon_type: DaemonType,
    },
    Test {
        #[command(subcommand)]
        test_type: TestType,
    },
    Fetch {
        #[command(subcommand)]
        fetch_type: FetchType,
    },
}

#[derive(Subcommand)]
enum DaemonType {
    Self_ { #[command(subcommand)] action: DaemonAction },
    Wlines { #[command(subcommand)] action: DaemonAction },
    All { #[command(subcommand)] action: DaemonAction },
}

#[derive(Subcommand)]
enum DaemonAction {
    Start,
    Stop,
    Restart,
    Status,
    Enable { method: StartupMethod },
    Disable { method: StartupMethod },
}
```

This declarative approach keeps the CLI interface consistent with minimal boilerplate. The structure in the code mirrors the structure users type at the command line.

The consistency makes the tool predictable. If you've used systemd, the daemon management commands feel familiar. If you haven't, the hierarchical structure (`windmenu <category> <target> <action>`) makes the available operations discoverable through tab completion and `--help` flags.

## Reparse Points

The launcher needs to find applications before it can launch them. Windows Store apps presented an unexpected challenge: unlike classic Win32 applications that live in `Program Files`, modern Windows apps hide in `%LOCALAPPDATA%\Microsoft\WindowsApps` as reparse points (symbolic links with extra metadata).

<!-- The naive approach I used for the classic startup shortcuts -->
The naive approach (treating them like regular shortcuts) failed immediately. These aren't `.lnk` files; they're special filesystem objects that Windows handles differently. The solution required detecting reparse points using `GetFileAttributesW` and the `FILE_ATTRIBUTE_REPARSE_POINT` flag:

```rust
pub fn is_reparse_point(path: &str) -> bool {
    unsafe {
        let wide_path = to_wide_string(path);
        let attrs = GetFileAttributesW(wide_path.as_ptr());


        if attrs == INVALID_FILE_ATTRIBUTES {
            return false;
        }

        (attrs & FILE_ATTRIBUTE_REPARSE_POINT) != 0
    }
}
```

This lets Windmenu find modern apps like Windows Terminal, Calculator, and Settings alongside traditional desktop applications. The scanning happens once at startup, keeping the hotkey response instant.

## Themes

Wlines originally configured everything via command-line arguments, like dmenu. For daemon mode, I added a text configuration file so wlines wouldn't parse dozens of flags on every invocation.

This meant having to maintain two config files: `windmenu.toml` for the launcher, `wlines-config.txt` for the UI. Different formats (verbose TOML for Rust, concise text for C), different field names. Users would need to understand both and remember which settings go where.

I solved this by auto-generating `wlines-config.txt` from a `[theme]` section in `windmenu.toml`:

```toml
[theme]
lines = 12
padding_x = 8
width_x = 1000
background_color = "#1e1e2e"
foreground_color = "#cdd6f4"
selected_background_color = "#89b4fa"
selected_foreground_color = "#1e1e2e"
text_background_color = "#313244"
text_foreground_color = "#cdd6f4"
font_size = 20
```

The `theme.rs` module translates these descriptive field names into wlines's format and generates `wlines-config.txt` on startup. Windmenu's config re-implements all of wlines's configuration fields. No reason to manually edit the generated file.

![Windmenu using the Catppuccin Mocha theme configured above](/img/mocha.png)

Themes become shareable: a `[theme]` section is just text. Copy someone's theme into your `windmenu.toml`, restart the daemon. Done.

Wlines stays independent. It's a standalone component with its own config file that doesn't need windmenu. Use it with your own scripts for password management or file selection. The auto-generation is windmenu's convenience layer, not a constraint on wlines.

## Static Linking

Initially, I compiled with Rust's MSVC toolchain on Windows. The binaries ran fine, but they required the Visual C++ redistributables (`vcruntime140.dll`, `api-ms-win-crt-*.dll`). I accepted this limit at first (most Windows machines have these installed anyway).

Later in, while I was developing the NSIS installer (we'll see right after), I couldn't tolerate it. **I wanted binaries that work everywhere**: copy `windmenu.exe` to any Windows 10/11 machine and run it. No redistributables, no runtime dependencies, no installation friction.

Rust's MSVC toolchain uses Microsoft's linker (`link.exe`), which defaults to dynamic linking for compatibility. The GNU toolchain (mingw) avoids this by using `gcc` and static linking by default. Building natively on Windows with the GNU toolchain still pulled in Microsoft CRT dependencies. Cross-compiling from Linux to Windows with mingw-w64 produced cleaner results. The `.cargo/config.toml` forces static linking:

```toml
[target.x86_64-pc-windows-gnu]
linker = "x86_64-w64-mingw32-gcc"
rustflags = [
    "-C", "panic=abort",
    "-C", "link-args=-static",
    "-C", "link-args=-Wl,-Bstatic",
    "-C", "link-args=-l:libmsvcrt.a",
    "-C", "link-args=-l:libucrt.a",
    "-C", "link-args=-l:libpthread.a",
    "-C", "link-args=-l:libgcc.a",
    "-C", "link-args=-nostartfiles",
    "-C", "link-args=-Wl,--gc-sections",
    "-C", "link-args=-Wl,--as-needed"
]
```

The `-l:lib*.a` syntax forces static linking of specific libraries. The explicit target means Cargo places output in `target/x86_64-pc-windows-gnu/release/` instead of `target/release/`. Dead code elimination (`--gc-sections`) and selective linking (`--as-needed`) reduce binary size.

Verifying dependencies with `dumpbin /DEPENDENTS`:

```
Microsoft (R) COFF/PE Dumper Version 14.42.34435.0
Copyright (C) Microsoft Corporation.  All rights reserved.


Dump of file target\x86_64-pc-windows-gnu\release\windmenu.exe

File Type: EXECUTABLE IMAGE

  Image has the following dependencies:

    KERNEL32.dll
    SHELL32.dll
    USER32.dll
    api-ms-win-core-synch-l1-2-0.dll
    bcryptprimitives.dll
    msvcrt.dll
    ntdll.dll
    USERENV.dll
    WS2_32.dll
```

These dependencies could be reduced further, but I don't expect people to (really) run this from Windows 3.1, and I'm not willing to give up Rust's threading primitives. This compromise works: system DLLs present on all Windows 10+ machines, no redistributables required.

## Installation

The project includes NSIS installer scripts with automated build tools for both PowerShell and Bash. The scripts handle dependency downloads (fetching `wlines-daemon.exe` from releases), Rust compilation, and packaging:

```powershell
.\build-installer.ps1
```

Windows startup methods are fragmented, and each has different privilege requirements and failure modes:

| Method                     | Privilege Required |
|----------------------------|--------------------|
| Registry                   | user               |
| Task Scheduler             | user               |
| Startup folder (User)      | user               |
| Startup folder (All users) | admin              |

Group Policy might block Task Scheduler but leave registry keys open. IT policies might lock down the registry but allow startup folder scripts. Some systems restrict everything except one method. Four options mean at least one works (hopefully).

The graphical installer covers the basics: binaries, dependencies, startup method options, uninstall support, and Start Menu shortcuts. It cleans up all startup methods on uninstall while preserving user-edited configuration files.

<!-- The image should be smaller -->
![windmenu nsis](/img/windmenu-nsis.png)

For users who prefer manual control, windmenu's CLI offers the same functionality:

```bash
windmenu daemon all enable registry
windmenu daemon all enable task
windmenu daemon wlines enable user-folder
```

The NSIS installer provides a graphical interface for these operations, while the CLI remains available for scripting and power users.

## What's Next

The current version of Windmenu is stable and daily-driveable. It's fast, configurable, and stays out of the way.

Some features I'm considering:

- **Frecency-based sorting**: Frequently and recently used apps should float to the top

- **WiFi network switching**: At some point during development, I thought "What if I could control WiFi networks from the launcher?" This led to implementing the `wlan.rs` module using Windows Native WiFi API. It wraps unsafe FFI calls in a safe Rust API with proper RAII cleanup via the `Drop` trait. Right now it supports forcing WiFi scans (useful for refreshing available networks), but what I really want is full network management (selecting and connecting to specific networks directly from Windmenu without touching the system tray). The infrastructure is there, waiting for the connection management pieces to be wired up.

- **Fast file search**: Using ripgrep, maybe, avoiding the bloat of Windows indexing

- **System tray control**: Managing visibility and lifecycle of system tray applications

But the core seems solid (on my machine, anyway). It does what I needed: provides a dmenu-like experience on Windows without compromise.

## Conclusions

Building Windmenu scratched a personal itch while exploring Windows system programming in Rust. What started as "I want dmenu on Windows" became a deep dive into Windows internals, daemon architecture, and building distributable system tools.

This project has been a learning journey, particularly around Win32 APIs, process management, and Rust's concurrency primitives on Windows. I'm still learning the nuances of Windows system programming, so if you spot areas for improvement or have suggestions about better approaches, I'd genuinely appreciate the feedback.

If you're tired of Windows start menu, give Windmenu a try. It's fast, minimal, and keyboard-first.

---

*Windmenu is available on [GitHub](https://github.com/gicrisf/windmenu). The installer includes everything you need to get started. If you find it useful, contributions and feedback are always welcome.*

[^1]: There's also [Copilot integration in the search](https://www.windowslatest.com/2025/10/19/microsoft-cant-fix-windows-11-search-so-its-handing-it-to-ask-copilot-on-the-taskbar/) now. Another AI layer sitting between you and your programs, analyzing search behavior to suggest actions. The taskbar search is being replaced with "Ask Copilot" - more processing, more latency, more things you didn't ask for.

[^2]: Of course, ideas flourished while I was working on it and now I do many other things with it, but this illustrates the core need. (We'll talk about how I use Emacs on Windows another time, I don't want to go off topic).
