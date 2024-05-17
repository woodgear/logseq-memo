async function memo() {
    const pageTitle = `memo-${Date.now()}`;
    const now = new Date()
    const page = await logseq.Editor.createPage(pageTitle, {
        createTime: new Date().toLocaleString(),
    }, { redirect: true });
    const today = `[[${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}]]`
    const first = await logseq.Editor.insertBlock(page.uuid, `#memo ${today}`)
    logseq.Editor.insertBlock(first.uuid, "")
    logseq.App.showMsg(`Page "${pageTitle}" created.`);
}

function main() {
    logseq.Editor.registerSlashCommand(
        'memo',
        memo
    )
    logseq.Editor.registerSlashCommand(
        'to-now',
        async () => {
            const now = new Date()
            const cur = await logseq.Editor.getCurrentBlock()
            await logseq.Editor.updateBlock(cur.uuid, `-${now.getHours()}:${now.getMinutes()} `)
        }
    )
    logseq.Editor.registerSlashCommand(
        'nownow',
        async () => {
            const now = new Date()
            const cur = await logseq.Editor.getCurrentBlock()
            await logseq.Editor.updateBlock(cur.uuid, `${now.getHours()}:${now.getMinutes()}`)
        }
    )
    logseq.App.registerCommandPalette(
        {
            key: 'create-memo-page',
            label: 'Create Memo Page',
            keybinding: {
                mode: 'global',
                binding: 'm m', // Optional keybinding, can be customized
            },
        },
        memo
    )
}

// bootstrap
logseq.ready(main).catch(console.error)