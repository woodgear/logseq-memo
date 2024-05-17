# command
## create-memo-page
```js
    const pageTitle = `memo-${Date.now()}`;
    const now = new Date()
    const page = await logseq.Editor.createPage(pageTitle, {
        createTime: new Date().toLocaleString(),
    }, { redirect: true });
    const today = `[[${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}]]`
    const first = await logseq.Editor.insertBlock(page.uuid, `#memo ${today}`)
    logseq.Editor.insertBlock(first.uuid, "")
    logseq.App.showMsg(`Page "${pageTitle}" created.`);
```
```json
{
    "key": "create-memo-page",
    "label": "Create Memo Page",
    "keybinding": {
        "mode": "global",
        "binding": "m m",
    },
},
```
# slash command
## /memo
same as create-memo-page