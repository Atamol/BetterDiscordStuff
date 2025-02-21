[English version](https://github.com/Atamol/BetterDiscordStuff/blob/master/Plugins/TypingIndicator/README.en.md) / 日本語版

---

# TypingIndicator
誰かが入力中のチャンネルまたはサーバー（ギルド）があるとき，チャンネルリストやサーバーリストにインジケータを表示します．

![typingindicator](https://user-images.githubusercontent.com/42084688/123513299-c4c5e080-d68c-11eb-8021-f68e755561cd.gif)

## 使用方法
プラグイン設定で表示したいオプションを有効にすると，チャンネルリストやサーバーリスト上でインジケータが点滅しているのを確認できます．

## 設定項目

### Show on channels
- チャンネルリストにインジケータを表示します

### Include muted channels
- ミュートされたチャンネルでも，入力中であればインジケータを表示します

### Show on guilds
- サーバー（ギルド）内のいずれかのチャンネルで誰かが入力中のとき，サーバーリストにインジケータを表示します
- ミュートされたチャンネルについては，`Include muted channels` オプションを有効にしている場合のみチェック対象となります


## Download
[右クリックして保存](https://raw.githubusercontent.com/Atamol/BetterDiscordStuff/master/Plugins/TypingIndicator/TypingIndicator.plugin.js)

---

# 修正内容

- **ChannelItemの取得方法を変更**
  - 以前の検索ロジックはDiscord側の変更により機能しなくなっていたため，`displayName === "ChannelItem"`を使って取得するようにしました
- **ChannelItem のパッチ適用先を更新**
  - `Patcher.after(ChannelItem, "Z", ...)`を廃止し，最新のコード構造に合わせて`Patcher.after(ChannelItemModule, "default", ...)`を使用するように変更しました
- **Utilities.findInReactTreeを用いてチャンネル名要素を特定し，スピナーを挿入**
  - 内部コンポーネント構造が多少変わっても壊れにくくなるよう，直接ツリーを探索して必要な要素にスピナーを挿入する方式に変更しました

## 注意事項

- Discord，およびBetterDiscordは頻繁にアップデートが行われるため，今後また動作しなくなる可能性があります
- もし不具合に気が付いたら，[管理人Twitter](https://x.com/Atamol_rc)へ連絡をいただけると助かります
