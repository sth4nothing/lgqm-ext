chrome.extension.sendMessage({
    message: 'localStorage'
}, function (data) {
    console.log(data)
    $(document).ready(function () {
        function blockPost(blockList) {
            var posts = document.querySelectorAll('div#postlist>div[id^="post_"]')
            for (var post of posts) {
                var a = post.querySelector('table.plhin>tbody>tr:first-child>td.pls>div>div.pi>div.authi>a.xw1')
                if (a && a.href !== undefined) {
                    var match = a.href.match(/^https:\/\/(?:www)?\.lgqm\.(?:gq|top)?\/space\-uid\-(?<uid>\d+)\.html$/)
                    if (match && match.groups.uid !== undefined) {
                        uid = match.groups.uid
                        if (blockList.has(uid)) {
                            post.style.display = 'none'
                        }
                    }
                }
            }
        }
        const blockList = new Set(JSON.parse(data.blockList))
        var url = window.location.href
        if (url.search(/^https:\/\/(?:www)?\.lgqm\.(?:gq|top)?\/thread\-\d+\-\d+\-\d+\.html/) == 0) {
            blockPost(blockList)
        } else {
            var match1 = url.match(/^https:\/\/(?:www)?\.lgqm\.(?:gq|top)?\/forum\.php\?(?<params>.+)$/)
            if (match1 && match1.groups.params !== undefined) {
                var matches = match1.groups.params.matchAll(/(?<key>[^&=]+)=(?<val>[\w\W]*?)(?=$|&)/g)
                var params = {}
                for (var match of matches) {
                    params[match.groups.key] = match.groups.val
                }
                if (params.mod == 'viewthread' && params.tid !== undefined) {
                    blockPost(blockList)
                }
            }
        }
    })
})