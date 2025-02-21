/**
 * @fork          This is a fork of the original TypingIndicator plugin.
 * @forkRepo      https://github.com/Atamol/BetterDiscordStuff/blob/master/Plugins/TypingIndicator/TypingIndicator.plugin.js
 * @forkSite      https://twitter.com/Atamol_rc
 * @forkAuthor    Atamol
 * @forkAuthorId  361086687234752514
 *
 * @name TypingIndicator
 * @displayName TypingIndicator
 * @website https://twitter.com/l0c4lh057/
 * @source https://github.com/l0c4lh057/BetterDiscordStuff/blob/master/Plugins/TypingIndicator/TypingIndicator.plugin.js
 * @patreon https://www.patreon.com/l0c4lh057
 * @invite YzzeuJPpyj
 * @authorId 226677096091484160, 917630027477159986, 933076363102007317
 * @author l0c4lh057 , imafrogowo , davilarek
 */

module.exports = (() => {
    const config = {
        info: {
            name: "TypingIndicator",
            authors: [
                {
                    name: "l0c4lh057",
                    github_username: "l0c4lh057",
                    twitter_username: "l0c4lh057",
                    discord_id: "226677096091484160"
                }
            ],
            description: "Shows an indicator in the guild/channel list when someone is typing there",
            version: "0.5.5",
            github: "https://github.com/l0c4lh057/BetterDiscordStuff/blob/master/Plugins/TypingIndicator/",
            github_raw: "https://raw.githubusercontent.com/l0c4lh057/BetterDiscordStuff/master/Plugins/TypingIndicator/TypingIndicator.plugin.js"
        },
        defaultConfig: [
            {
                type: "switch",
                id: "channels",
                name: "Show on channels",
                note: "Enable typing indicator on channel list (default: true)",
                value: true
            },
            {
                type: "switch",
                id: "includeMuted",
                name: "Include muted channels/guilds",
                note: "Even muted channels will show typing indicator (default: false)",
                value: false
            },
            {
                type: "switch",
                id: "includeBlocked",
                name: "Include blocked users",
                note: "Blocked users also trigger indicator (default: false)",
                value: false
            },
            {
                type: "switch",
                id: "guilds",
                name: "Show on guilds",
                note: "Enable indicator on guild icons (default: false)",
                value: false
            },
            {
                type: "switch",
                id: "folders",
                name: "Show on folders",
                note: "Enable indicator on Discord's native folder icons (default: false)",
                value: false
            },
            {
                type: "switch",
                id: "dms",
                name: "Show on home icon",
                note: "Enable indicator on the home icon above the guild list (default: false)",
                value: false
            }
        ],
        changelog: [
            {
                title: "Fixed",
                type: "fixed",
                items: [
                    "Patched ChannelItem retrieval so it no longer breaks on the latest BetterDiscord/Discord updates."
                ]
            }
        ]
    };

    return !global.ZeresPluginLibrary
        ? class {
              constructor() {
                  this._config = config;
              }
              getName() {
                  return config.info.name;
              }
              getAuthor() {
                  return config.info.authors.map((a) => a.name).join(", ");
              }
              getDescription() {
                  return (
                      config.info.description +
                      " **Install [ZeresPluginLibrary](https://betterdiscord.app/Download?id=9) and restart discord to use this plugin!**"
                  );
              }
              getVersion() {
                  return config.info.version;
              }
              load() {
                  BdApi.showConfirmationModal(
                      "Library Missing",
                      `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
                      {
                          confirmText: "Download Now",
                          cancelText: "Cancel",
                          onConfirm: () => {
                              require("request").get(
                                  "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                                  async (error, response, body) => {
                                      if (error)
                                          return require("electron").shell.openExternal(
                                              "https://betterdiscord.app/Download?id=9"
                                          );
                                      await new Promise((r) =>
                                          require("fs").writeFile(
                                              require("path").join(
                                                  BdApi.Plugins.folder,
                                                  "0PluginLibrary.plugin.js"
                                              ),
                                              body,
                                              r
                                          )
                                      );
                                  }
                              );
                          }
                      }
                  );
              }
              start() {}
              stop() {}
          }
        : (([Plugin, Api]) => {
              const {
                  WebpackModules,
                  DiscordModules,
                  Patcher,
                  ReactComponents,
                  PluginUtilities,
                  Utilities,
                  ReactTools,
                  Logger
              } = Api;
              const {
                  React,
                  ChannelStore,
                  UserStore,
                  UserTypingStore,
                  RelationshipStore,
                  SelectedGuildStore,
                  DiscordConstants,
                  WindowInfo
              } = DiscordModules;
              const Flux = WebpackModules.getByProps("connectStores");
              const FluxUtils = WebpackModules.getByProps("useStateFromStores");
              const MutedStore = WebpackModules.getByProps("isMuted", "isChannelMuted");
              const { Spinner } = BdApi.Webpack.getModule((x) => x?.Spinner) || {};
              const Tooltip = BdApi.Components.Tooltip;

              const renderElement = ({ userIds, opacity, type, isFocused, id }) => {
                  userIds = [...new Set(userIds)];
                  if (userIds.length === 0) return null;
                  const usernames = userIds
                      .map((userId) => UserStore.getUser(userId))
                      .filter((user) => user !== null)
                      .map((user) => user.tag);
                  const filteredUsernames = usernames.map((username) =>
                      username.replace(/#0000$/, "")
                  );

                  const remainingUserCount = userIds.length - usernames.length;
                  const text = (() => {
                      if (filteredUsernames.length === 0) {
                          return `${remainingUserCount} user${
                              remainingUserCount > 1 ? "s" : ""
                          }`;
                      } else if (userIds.length > 2) {
                          const otherCount = filteredUsernames.length - 1 + remainingUserCount;
                          return `${filteredUsernames[0]} and ${otherCount} other${
                              otherCount > 1 ? "s" : ""
                          }`;
                      } else if (remainingUserCount === 0) {
                          return filteredUsernames.join(", ");
                      } else {
                          return `${filteredUsernames.join(", ")} and ${remainingUserCount} other${
                              remainingUserCount > 1 ? "s" : ""
                          }`;
                      }
                  })();

                  if (!Spinner) return null;

                  return React.createElement(
                      Tooltip,
                      {
                          text,
                          position: type === "channel" ? "top" : "right"
                      },
                      (tooltipProps) =>
                          React.createElement(Spinner, {
                              ...tooltipProps,
                              type: "pulsingEllipsis",
                              className: `ti-indicator typingindicator-${type}`,
                              [`data-${type}-id`]: id,
                              animated: isFocused,
                              style: {
                                  marginLeft: 5,
                                  opacity: opacity
                              }
                          })
                  );
              };

              return class TypingIndicator extends Plugin {
                  onStart() {
                      PluginUtilities.addStyle(
                          "typingindicator-css",
                          `
                          .typingindicator-guild, .typingindicator-dms, .typingindicator-folder {
                              position: absolute !important;
                              bottom: 0 !important;
                              padding: 3px !important;
                              border-radius: 6px !important;
                              background-color: var(--background-tertiary) !important;
                              right: 14px !important;
                          }
                          .ti-indicator span.pulsingEllipsisItem-3pNmEc {
                              background-color: var(--channels-default) !important;
                          }
                          .ti-indicator .pulsingEllipsis-3YiXRF {
                              width: 22px !important;
                          }
                          .ti-indicator .pulsingEllipsisItem-3pNmEc:nth-of-type(3) {
                              margin-right: 0 !important;
                          }
                      `
                      );
                      this.promises = { state: { cancelled: false }, cancel() { this.state.cancelled = true; } };

                      this.patchChannelList();
                      this.patchGuildList(this.promises.state);
                      this.patchHomeIcon(this.promises.state);
                      this.patchFolders(this.promises.state);
                  }

                  onStop() {
                      PluginUtilities.removeStyle("typingindicator-css");
                      this.promises.cancel();
                      Patcher.unpatchAll();
                  }

                  getGuildChannels(...guildIds) {
                      const all =
                          ChannelStore.getGuildChannels?.() ||
                          ChannelStore.getMutableGuildChannels?.() ||
                          [];
                      const channels = Array.isArray(all) ? all : Object.values(all);
                      return channels.filter(
                          (c) =>
                              guildIds.includes(c.guild_id) &&
                              c.type !== DiscordConstants.ChannelTypes.GUILD_VOICE &&
                              c.type !== DiscordConstants.ChannelTypes.GUILD_CATEGORY
                      );
                  }

                  getPrivateChannels() {
                      const all =
                          ChannelStore.getPrivateChannels?.() ||
                          ChannelStore.getMutablePrivateChannels?.() ||
                          [];
                      return Array.isArray(all) ? all : Object.values(all);
                  }

                  patchChannelList() {
                      const ChannelItemModule = BdApi.Webpack.getModule(
                          (m) => m?.default?.displayName === "ChannelItem"
                      );
                      if (!ChannelItemModule) {
                          Logger.warn("Could not find ChannelItem, channel indicator won't be shown.");
                          return;
                      }

                      Patcher.after(
                          ChannelItemModule,
                          "default",
                          (thisObject, [props], returnValue) => {
                              if (!this.settings.channels) return;
                              if (!props?.channel) return;

                              if (props.muted && !this.settings.includeMuted) return;

                              const selfId = UserStore.getCurrentUser()?.id;
                              if (!selfId) return;

                              const fluxWrapper = Flux.connectStores(
                                  [UserTypingStore, WindowInfo],
                                  () => {
                                      const typingUsers = Object.keys(
                                          UserTypingStore.getTypingUsers(props.channel.id) ?? {}
                                      );
                                      return {
                                          userIds: typingUsers.filter(
                                              (uId) =>
                                                  uId !== selfId &&
                                                  (this.settings.includeBlocked ||
                                                      !RelationshipStore.isBlocked(uId))
                                          )
                                      };
                                  }
                              );
                              const wrappedCount = fluxWrapper(({ userIds }) => {
                                  return React.createElement(renderElement, {
                                      userIds,
                                      opacity: 0.7,
                                      type: "channel",
                                      isFocused: WindowInfo.isFocused(),
                                      id: props.channel.id
                                  });
                              });

                              if (!returnValue) return;

                              const channelLabel = Utilities.findInReactTree(
                                  returnValue,
                                  (c) =>
                                      c &&
                                      typeof c === "object" &&
                                      c.props &&
                                      typeof c.props.className === "string" &&
                                      c.props.className.includes("name-")
                              );

                              if (channelLabel && channelLabel.props) {
                                  if (!channelLabel.props.children) {
                                      channelLabel.props.children = [];
                                  } else if (
                                      !Array.isArray(channelLabel.props.children)
                                  ) {
                                      channelLabel.props.children = [
                                          channelLabel.props.children
                                      ];
                                  }
                                  channelLabel.props.children.push(
                                      React.createElement(wrappedCount)
                                  );
                              }
                          }
                      );
                  }

                  patchGuildList(promiseState) {
                      try {
                          const result = (target =>
                              target
                                  ? [
                                        target,
                                        Object.keys(target).find((k) =>
                                            ["includeActivity", "onBlur"].every((s) =>
                                                target[k]?.toString?.().includes(s)
                                            )
                                        )
                                    ]
                                  : [])(
                              WebpackModules.getModule(
                                  (m) =>
                                      Object.values(m).some((fn) =>
                                          ["includeActivity", "onBlur"].every((s) =>
                                              fn?.toString?.().includes(s)
                                          )
                                      ),
                                  { searchGetters: false }
                              )
                          );

                          const selfId = UserStore.getCurrentUser()?.id;
                          if (!selfId)
                              return setTimeout(() => this.patchGuildList(promiseState), 100);

                          const Indicator = (guildId) => {
                              const props = FluxUtils.useStateFromStoresObject(
                                  [
                                      UserStore,
                                      RelationshipStore,
                                      WindowInfo,
                                      UserTypingStore,
                                      MutedStore,
                                      UserStore
                                  ],
                                  () => {
                                      const selfId = UserStore.getCurrentUser().id;
                                      return {
                                          userIds: this.getGuildChannels(guildId)
                                              .filter(
                                                  (channel) =>
                                                      this.settings.includeMuted ||
                                                      !MutedStore.isChannelMuted(
                                                          channel.guild_id,
                                                          channel.id
                                                      )
                                              )
                                              .flatMap((channel) =>
                                                  Object.keys(
                                                      UserTypingStore.getTypingUsers(channel.id)
                                                  )
                                              )
                                              .filter(
                                                  (userId) =>
                                                      userId !== selfId &&
                                                      (this.settings.includeBlocked ||
                                                          !RelationshipStore.isBlocked(userId))
                                              ),
                                          isFocused: WindowInfo.isFocused()
                                      };
                                  }
                              );
                              return React.createElement(renderElement, {
                                  ...props,
                                  opacity: 1,
                                  id: guildId,
                                  type: "guild"
                              });
                          };

                          const PatchedGuild = ({ __TI_original, ...props }) => {
                              const returnValue = __TI_original(props);
                              try {
                                  if (props.selected) return returnValue;
                                  if (!this.settings.guilds) return returnValue;
                                  if (!props.guild) return returnValue;
                                  if (
                                      MutedStore.isMuted(props.guild.id) &&
                                      !this.settings.includeMuted
                                  )
                                      return returnValue;
                                  returnValue.props.children.props.children.push(
                                      Indicator(props.guild.id)
                                  );
                              } catch (err) {
                                  Logger.error("Error in Guild patch", err);
                              }
                              return returnValue;
                          };

                          Patcher.after(...result, (_, [args], returnValue) => {
                              Patcher.after(
                                  returnValue.props.text,
                                  "type",
                                  (self, _, value) => {
                                      const original = returnValue.type;
                                      returnValue.type = PatchedGuild;
                                  }
                              );
                          });

                          this.forceUpdateGuilds(promiseState);
                      } catch (e) {
                          Logger.error("patchGuildList failed:", e);
                      }
                  }

                  forceUpdateGuilds(promiseState) {
                      const scroller = document.querySelector(".scroller-1Bvpku");
                      if (scroller) {
                          scroller.dispatchEvent(new CustomEvent("scroll"));
                      }
                  }

                  async patchHomeIcon(promiseState) {
                      const Home = await ReactComponents.getComponentByName(
                          "TutorialIndicator",
                          "." +
                              WebpackModules.getByProps(
                                  "badgeIcon",
                                  "circleIcon",
                                  "listItem",
                                  "pill"
                              ).listItem.replace(/ /g, ".")
                      );
                      if (promiseState.cancelled) return;
                      const selfId = UserStore.getCurrentUser()?.id;
                      if (!selfId)
                          return setTimeout(() => this.patchHomeIcon(promiseState), 100);

                      Patcher.after(Home.component.prototype, "render", (thisObject, _, rv) => {
                          if (!rv.props.children) return;
                          let children = rv.props.children[0] || rv.props.children;
                          if (!children.props) return;
                          if (!children.props.children || !children.props.className) return;
                          if (!children.props.children.props || !children.props.children.props.children)
                              return;

                          children = children.props.children.props.children[1];
                          if (!children) return;
                          if (!this.settings.dms) return;

                          const fluxWrapper = Flux.connectStores([UserTypingStore, WindowInfo], () => {
                              const privateChannels = this.getPrivateChannels();
                              const userIds = privateChannels
                                  .filter((c) =>
                                      this.settings.includeMuted
                                          ? true
                                          : !MutedStore.isChannelMuted(null, c.id)
                                  )
                                  .flatMap((c) =>
                                      Object.keys(UserTypingStore.getTypingUsers(c.id)).filter(
                                          (uId) =>
                                              uId !== selfId &&
                                              (this.settings.includeBlocked ||
                                                  !RelationshipStore.isBlocked(uId))
                                      )
                                  );
                              return { userIds };
                          });

                          const wrappedCount = fluxWrapper(({ userIds }) => {
                              return React.createElement(renderElement, {
                                  userIds,
                                  opacity: 1,
                                  type: "dms",
                                  isFocused: WindowInfo.isFocused()
                              });
                          });

                          children.props.children = React.Children.toArray(
                              children.props.children.children.props.children
                          );
                          if (children.props.children.push) {
                              children.props.children.push(React.createElement(wrappedCount));
                          }
                      });
                      Home.forceUpdateAll();
                  }

                  async patchFolders(promiseState) {
                      const Folder = WebpackModules.find(
                          (m) =>
                              m?.type?.render &&
                              (m?.type?.render || m?.type?.__powercordOriginal_render)
                                  ?.toString()
                                  ?.includes("SERVER_FOLDER")
                      );
                      if (promiseState.cancelled || !Folder) return;
                      const selfId = UserStore.getCurrentUser()?.id;
                      if (!selfId) return setTimeout(() => this.patchFolders(promiseState), 100);

                      Patcher.after(Folder.type, "render", (_, [props], rv) => {
                          if (props.expanded) return;
                          if (!this.settings.folders) return;
                          const fluxWrapper = Flux.connectStores(
                              [UserTypingStore, WindowInfo],
                              () => ({
                                  userIds: this.getGuildChannels(...props.guildIds)
                                      .filter(
                                          (c) =>
                                              (this.settings.includeMuted ||
                                                  !MutedStore.isMuted(c.guild_id)) &&
                                              (this.settings.includeMuted ||
                                                  !MutedStore.isChannelMuted(
                                                      c.guild_id,
                                                      c.id
                                                  )) &&
                                              SelectedGuildStore.getGuildId() !== c.guild_id
                                      )
                                      .flatMap((c) =>
                                          Object.keys(UserTypingStore.getTypingUsers(c.id)).filter(
                                              (uId) =>
                                                  uId !== selfId &&
                                                  (this.settings.includeBlocked ||
                                                      !RelationshipStore.isBlocked(uId))
                                          )
                                      )
                              })
                          );
                          const wrappedCount = fluxWrapper(({ userIds }) => {
                              return React.createElement(renderElement, {
                                  userIds,
                                  opacity: 1,
                                  type: "folder",
                                  isFocused: WindowInfo.isFocused(),
                                  id: props.folderId
                              });
                          });
                          rv.props.children.push(React.createElement(wrappedCount));
                      });
                  }

                  getSettingsPanel() {
                      return this.buildSettingsPanel().getElement();
                  }
              };
          })(global.ZeresPluginLibrary.buildPlugin(config));
})();
