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

async function update_start() {
    const now = new Date()
    const now_str = `${now.getHours()}:${now.getMinutes()}`
    const cur = await logseq.Editor.getCurrentBlock()
    const content = cur.content
    if (content == "") {
        await logseq.Editor.updateBlock(cur.uuid, `${now_str}`)
        return
    }
    // update start time
    if (content.match(/^\d{1,2}:\d{1,2}/)) {
        const matched = content.match(/^(\d{1,2}:\d{1,2})/)[1]
        const content_new = content.replace(matched, `${now.getHours()}:${now.getMinutes()}`)
        await logseq.Editor.updateBlock(cur.uuid, content_new)
    } else {
        const content_new = `${now_str} ${content}`
        await logseq.Editor.updateBlock(cur.uuid, content_new)
    }
}

async function update_end() {
    const now = new Date()
    const now_str = `${now.getHours()}:${now.getMinutes()}`
    const cur = await logseq.Editor.getCurrentBlock()
    const content = cur.content
    if (content == "") {
        await logseq.Editor.updateBlock(cur.uuid, `${now_str}`)
        return
    }
    // only has start
    if (content.match(/^(\d{1,2}:\d{1,2}) /)) {
        const matched = content.match(/^(\d{1,2}:\d{1,2})/)[1]
        const content_new = content.replace(matched, `${matched}-${now_str}`)
        await logseq.Editor.updateBlock(cur.uuid, content_new)
        return
    }
    // has start and end
    if (content.match(/^(\d{1,2}:\d{1,2})-(\d{1,2}:\d{1,2})/)) {
        const matched = content.match(/^(\d{1,2}:\d{1,2})-(\d{1,2}:\d{1,2})/)[2]
        const content_new = content.replace(matched, `${now_str}`)
        await logseq.Editor.updateBlock(cur.uuid, content_new)
        return
    }
    // has no time
    await logseq.Editor.updateBlock(cur.uuid, `${now_str} ${content}`)
}

function main() {
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
    logseq.App.registerCommandPalette(
        {
            key: 'modify-start-time',
            label: 'update current block start time to now',
            keybinding: {
                mode: 'global',
                binding: 'm s', // Optional keybinding, can be customized
            },
        },
        update_start
    )
    logseq.App.registerCommandPalette(
        {
            key: 'modify-end-time',
            label: 'update current block end time to now',
            keybinding: {
                mode: 'global',
                binding: 'm e', // Optional keybinding, can be customized
            },
        },
        update_end
    )
}

// bootstrap
logseq.ready(main).catch(console.error)