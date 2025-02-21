[日本語版](https://github.com/Atamol/BetterDiscordStuff/edit/master/Plugins/TypingIndicator/README.ja.md)

---

# TypingIndicator
Adds a little indicator to your channel and guild lists whenever someone's typing!

![typingindicator](https://user-images.githubusercontent.com/42084688/123513299-c4c5e080-d68c-11eb-8021-f68e755561cd.gif)

## Usage
Just enable whichever options you like in the plugin settings, and watch those indicators pop up.

## Settings
### Show on channels
- Puts a typing indicator in the channel list

### Include muted channels
- Also shows the indicator on muted channels

### Show on guilds
- Shows a typing indicator on the guild icon if someone is typing in any of its channels
- If you only want it for unmuted channels, keep `Include muted channels` turned off

## Download
[Right-click here to download](https://raw.githubusercontent.com/Atamol/BetterDiscordStuff/master/Plugins/TypingIndicator/TypingIndicator.plugin.js)

---

# Fixed

- **Tweaked how we grab `ChannelItem`**  
  The old logic broke due to Discord’s internal changes, so we now search by `displayName === "ChannelItem"`

- **Updated patch target for `ChannelItem`**  
  We switched from `Patcher.after(ChannelItem, "Z", ...)` to `Patcher.after(ChannelItemModule, "default", ...)` to match the new code structure

- **Using `Utilities.findInReactTree`**  
  We now locate the channel name element and insert the spinner there. This makes it more resilient to small changes in Discord’s layout

## Notes
- BetterDiscord and Discord get updated pretty frequently, so there’s a chance this fix might break again in the future
- If you run into any bugs or issues, feel free to let me know on my [Twitter (X)](https://x.com/Atamol_rc)
