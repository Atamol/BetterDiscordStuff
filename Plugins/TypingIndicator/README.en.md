[日本語版](https://github.com/Atamol/BetterDiscordStuff/Plugins/TypingIndicator/README.ja.md)

---

# TypingIndicator
Adds an indicator to the channel and guild list when someone is typing there

![typingindicator](https://user-images.githubusercontent.com/42084688/123513299-c4c5e080-d68c-11eb-8021-f68e755561cd.gif)

## Usage
Just enable the options you want in the plugin settings and watch the indicators blink.

## Settings
### Show on channels
- Shows the indicator in the channel list.
### Include muted channels
- Shows the indicator in the channel list for muted channels.
### Show on guilds
- Shows the indicator in the guild list when someone is typing in any of the channels. Muted channels are only checked when `Include muted channels` is enabled.

## Download
[Right click here to download](https://raw.githubusercontent.com/Atamol/BetterDiscordStuff/master/Plugins/TypingIndicator/TypingIndicator.plugin.js)

---

# Fixed

- Changed the way we retrieve ChannelItem
  - The old search logic no longer worked due to changes in Discord’s code. We now look for displayName === "ChannelItem".
- Updated patch target for ChannelItem
  - I replaced Patcher.after(ChannelItem, "Z", ...) with Patcher.after(ChannelItemModule, "default", ...) to align with the new code structure
- Use Utilities.findInReactTree to locate the channel name element and insert the spinner
  - This approach is more resilient to small changes in the internal component structure

## Notes
- Both BetterDiscord and Discord are frequently updated, so this fix may break again in the future. If it happens, similar patch adjustments might be required
