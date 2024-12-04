async function memo() {
    const pageTitle = `memo-${Date.now()}`;
    const now = new Date()
    const page = await logseq.Editor.createPage(pageTitle, {
        createTime: new Date().toLocaleString(),
    }, { redirect: true });
    const first = await logseq.Editor.insertBlock(page.uuid, `#memo`)
    logseq.Editor.insertBlock(first.uuid, "")
    logseq.App.showMsg(`Page "${pageTitle}" created.`);
}

function lq_now_str() {
    const now = new Date()
    const now_str = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    return now_str
}
async function update_start() {
    const now_str = lq_now_str()
    const cur = await logseq.Editor.getCurrentBlock()
    console.log("update start", cur.body, "|||", cur.content)
    const content = cur.content
    if (content == "") {
        console.log("empty block")
        await logseq.Editor.updateBlock(cur.uuid, `${now_str}`)
        return
    }
    // update start time
    if (content.match(/^\d{1,2}:\d{1,2}/)) {
        console.log("has start update start block")
        const matched = content.match(/^(\d{1,2}:\d{1,2})/)[1]
        const content_new = content.replace(matched, `${now.getHours()}:${now.getMinutes()}`)
        await logseq.Editor.updateBlock(cur.uuid, content_new)
    } else {
        console.log("append start")
        const content_new = `${now_str} ${content}`
        await logseq.Editor.updateBlock(cur.uuid, content_new)
    }
}

async function update_end() {
    const cur = await logseq.Editor.getCurrentBlock()
    const now_str = lq_now_str()
    const content = cur.content
    console.log("update end", cur.body, "|||", cur.content)
    if (content == "") {
        console.log("empty block")
        await logseq.Editor.updateBlock(cur.uuid, `${now_str}`)
        return
    }

    // has start and end
    if (content.match(/^(\d{1,2}:\d{1,2})-(\d{1,2}:\d{1,2}).*/)) {
        console.log("already has range", content)
        const matched = content.match(/^(\d{1,2}:\d{1,2})-(\d{1,2}:\d{1,2})/)[2]
        const content_new = content.replace(matched, `${now_str}`)
        await logseq.Editor.updateBlock(cur.uuid, content_new)
        return
    }
    // only has start
    if (content.match(/^\s*(\d{1,2}:\d{1,2}\-?)\s*.*/)) {
        console.log("only has start")
        const matched = content.match(/^(\d{1,2}:\d{1,2}\-?)/)[1]
        const matched_without_dash = matched.replace("-", "")
        const replaced = `${matched_without_dash}-${now_str}`
        console.log("matched", matched, replaced)
        const content_new = content.replace(matched, replaced)
        await logseq.Editor.updateBlock(cur.uuid, content_new)
        return
    }
    console.log("has no time", content)
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
