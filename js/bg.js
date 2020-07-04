var status = {
    last_sum: -1,
}
const scheme = 'https://www.'

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    var url = info.linkUrl
    // https://www.lgqm.top/space-uid-360.html
    // https://www.lgqm.top/?360
    // https://www.lgqm.top/home.php?mod=space&uid=360
    var match = url.match(/^https:\/\/(?:www)?\.lgqm\.(?:gq|top)?\/(?:space\-uid\-(?<a>\d+)\.html|\?(?<b>\d+)|home.php\?.*uid=(?<c>\d+))/)
    if (match == null) {
        return
    }
    var userId = match.groups.a || match.groups.b || match.groups.c
    switch (info.menuItemId) {
        case 'blockUser':
            console.log('block', userId)
            var blockList = new Set(JSON.parse(localStorage.blockList))
            blockList.add(userId)
            localStorage.blockList = JSON.stringify(Array.from(blockList))
            break
        default:
            break
    }
});

// chrome.runtime.onInstalled.addListener(function () {
console.log("register contextMenus")
var contexts = ['link'];
chrome.contextMenus.create({
    title: '屏蔽',
    contexts: contexts,
    id: 'blockUser',
})
// })

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'localStorage') {
        sendResponse(localStorage)
    } else {
        sendResponse({})
    }
});

chrome.notifications.onButtonClicked.addListener(function () {
    var url = scheme + localStorage.host + '/home.php?mod=space&do=notice'
    window.open(url, '_blank')
})

function success(data, stat, xhr) {
    uid = data.Variables.member_uid
    if (uid && Number(uid) > 0) {
        sum = 0
        for (var key in data.Variables.notice) {
            sum += Number(data.Variables.notice[key])
        }
        if (sum > 0 && status.last_sum != sum) {
            status.last_sum = sum
            console.log('收到新消息:' + sum + '条')
            chrome.notifications.create(null, {
                type: 'basic',
                title: '新消息',
                message: '收到新消息:' + sum + '条',
                iconUrl: 'img/icon.png',
                buttons: [{
                    title: '查看'
                }]
            })
        } else {
            status.last_sum = sum
            console.log('没有新消息')
        }
    } else {
        console.log('未登录')
    }
}

function fail(xhr, stat, e) {
    console.log(xhr, stat, e)
}

function query() {
    console.log(localStorage.interval + 's')
    console.log(scheme + localStorage.host + '/api/mobile/')
    $.ajax({
        method: 'GET',
        url: scheme + localStorage.host + '/api/mobile/',
        data: {
            'module': 'mynotelist',
            'view': 'mypost',
            'version': '4'
        },
        async: false,
        type: 'json',
        success: success,
        error: fail
    })
    setTimeout(query, Math.max(Number(localStorage.interval), 5) * 1000)
}
query()