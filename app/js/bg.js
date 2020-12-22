const $ = require('jquery')
const config = require('./config')
const scheme = 'https://'
const prefix = scheme.replace(/https?\:\/\//g, '')

var status = {
    last_sum: -1,
}

function appendBlockUser(userId) {
    if (Number(userId) > 0) {
        var blockList = new Set(JSON.parse(localStorage.blockList))
        blockList.add(userId)
        localStorage.blockList = JSON.stringify(Array.from(blockList))
    }
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case 'blockUser': {
            var url = info.linkUrl || info.pageUrl
            // https://www.lgqm.top/space-uid-360.html
            // https://www.lgqm.top/?360
            // https://www.lgqm.top/home.php?mod=space&uid=360
            if (url) {
                var match = url.match(/^https:\/\/(?:www\.)?lgqm\.(?:gq|top)\/(?:space\-uid\-(?<a>\d+)\.html|\?(?<b>\d+)|home.php\?.*\buid=(?<c>\d+)\b)/)
                // 数字uid
                if (match != null) {
                    var userId = match.groups.a || match.groups.b || match.groups.c
                    console.log('block', userId)
                    appendBlockUser(userId)
                } else {
                    var match1 = url.match(/^https:\/\/(?:www\.)?lgqm\.(?:gq|top)\/(?:space-username-(?<a>.+)\.html|home.php\?.*\busername=(?<b>[^&]+))/)
                    // username
                    if (match1 != null) {
                        var username = decodeURI(match1.groups.a || match1.groups.b)
                        $.ajax({
                            method: 'GET',
                            url: scheme + localStorage.host + '/api/mobile/',
                            data: {
                                'version': '4',
                                'module': 'profile',
                                'username': username,
                            },
                            async: true,
                            type: 'json',
                            success: function (data) {
                                if (data && data.Variables && data.Variables.space && data.Variables.space.uid) {
                                    var userId = data.Variables.space.uid
                                    appendBlockUser(userId)
                                }
                            }
                        })
                    }
                }
            }
            break
        }
        case 'wikiSearch': {
            var data = info.selectionText
            if (data) {
                window.open('https://lgqm.huijiwiki.com/index.php?profile=all&fulltext=1&search=' + encodeURI(data), '_blank')
            }
            break
        }
        case 'wikiPage': {
            var data = info.selectionText
            if (data) {
                window.open('https://lgqm.huijiwiki.com/index.php?profile=all&search=' + encodeURI(data), '_blank')
            }
            break
        }
        default:
            break
    }
})

console.log("register contextMenus")
var menus = [{
    id: 'main',
    title: '临高启明论坛助手',
    contexts: ['page', 'link', 'selection']
}, {
    id: 'blockUser',
    title: '屏蔽',
    contexts: ['page', 'link'],
    documentUrlPatterns: ['https://*.lgqm.gq/*', 'https://*.lgqm.top/*'],
    targetUrlPatterns: ['https://*.lgqm.gq/*', 'https://*.lgqm.top/*'],
    parentId: 'main',
}, {
    id: 'wikiSearch',
    title: '搜索维基页面%s”',
    contexts: ['selection'],
    parentId: 'main',
}, {
    id: 'wikiPage',
    title: '前往or搜索维基页面“%s”',
    contexts: ['selection'],
    parentId: 'main',
}]
for (var menu of menus) {
    chrome.contextMenus.create(menu)
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'localStorage') {
        sendResponse(localStorage)
    } else {
        sendResponse({})
    }
})

chrome.notifications.onButtonClicked.addListener(function () {
    var url = scheme + localStorage.host + '/home.php?mod=space&do=notice'
    window.open(url, '_blank')
})

function success(data, stat, xhr) {
    uid = data.Variables.member_uid
    if (uid && Number(uid) > 0) {
        localStorage.uid = uid
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
exports.config = config
exports.scheme = scheme
exports.status = status
exports.appendBlockUser = appendBlockUser
exports.success = success
exports.fail = fail
exports.query = query