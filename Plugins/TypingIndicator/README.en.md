[日本語版](https://github.com/Atamol/BetterDiscordStuff/blob/master/Plugins/TypingIndicator/README.ja.md) / English Version

---

# TypingIndicator
Adds an indicator to the channel and guild list when someone is typing there

![typingindicator](https://user-images.githubusercontent.com/42084688/123513299-c4c5e080-d68c-11eb-8021-f68e755561cd.gif)


## Usage
Just enable the options you want in the plugin settings and watch the indicators blink.

## Settings

### Show on channels
- Shows the indicator in the channel list

### Include muted channels
- Shows the indicator in the channel list for muted channels

### Show on guilds
- Shows the indicator in the guild list when someone is typing in any of the channels. Muted channels are only checked when `Include muted channels` is enabled

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
