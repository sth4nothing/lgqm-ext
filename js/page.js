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

// 南海农庄助手

var runScripts = new Set()

function stringxor(s1, s2) {
    var s = '';
    var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var max = Math.max(s1.length, s2.length);
    for (var i = 0; i < max; i++) {
        var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
        s += hash.charAt(k % 52);
    }
    return s;
}

function hash(string, length) {
    var length = length ? length : 32;
    var start = 0;
    var i = 0;
    var result = '';
    filllen = length - string.length % length;
    for (i = 0; i < filllen; i++) {
        string += "0";
    }
    while (start < string.length) {
        result = stringxor(result, string.substr(start, length));
        start += length;
    }
    return result;
}

function appendscript(src, text, reload, charset) {
    var id = hash(src + text)
    if (!reload && runScripts.has(id))
        return
    if (reload && document.getElementById(id)) {
        $('#' + id).remove()
    }
    runScripts.add(id)
    var scriptNode = document.createElement("script")
    scriptNode.type = "text/javascript"
    scriptNode.id = id
    scriptNode.charset = charset ? charset : (document.characterSet ? document.characterSet : document.charset);
    try {
        if (src) {
            scriptNode.src = src
            scriptNode.onloadDone = false
            scriptNode.onload = function () {
                scriptNode.onloadDone = true
            }

            scriptNode.onreadystatechange = function () {
                if ((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
                    scriptNode.onloadDone = true
                }
            }

        } else if (text) {
            scriptNode.text = text
        }
        document.getElementsByTagName('head')[0].appendChild(scriptNode)
    } catch (e) {}
}

function ajaxget(url, showid, callback=null) {
    url = url + '&inajax=1&ajaxtarget=' + showid
    $.get(url, function (data, status, xhr) {
        var xml = xhr.responseXML.lastChild.firstChild.nodeValue
        if (xml.indexOf('<script') < 0) {
            return
        }
        if (showid) {
            var element = document.getElementById(showid)
            element.style.display = ''
            if (element.tagName != 'TBODY') {
                element.innerHTML = xml
            } else {
                while (element.firstChild) {
                    element.firstChild.parentNode.removeChild(element.firstChild)
                }
                var div1 = document.createElement('DIV')
                div1.id = element.id + '_div'
                div1.innerHTML = '<table><tbody id="' + element.id + '_tbody">' + s + '</tbody></table>'
                document.getElementById('append_parent').appendChild(div1)
                var trs = div1.getElementsByTagName('TR')
                var l = trs.length
                for (var i = 0; i < l; i++) {
                    element.appendChild(trs[0])
                }
                var inputs = div1.getElementsByTagName('INPUT')
                var l = inputs.length
                for (var i = 0; i < l; i++) {
                    element.appendChild(inputs[0])
                }
                div1.parentNode.removeChild(div1)
            }
        }
        var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig
        var arr
        while (arr = p.exec(xml)) {
            var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/i
            var arr1 = p1.exec(arr[0]);
            if (arr1) {
                appendscript(arr1[1], '', arr1[2], arr1[3])
            } else {
                p1 = /<script(.*?)>([^\x00]+?)<\/script>/i
                arr1 = p1.exec(arr[0])
                appendscript('', arr1[2], arr1[1].indexOf('reload=') != -1)
            }
        }
        if (callback !== null) {
            callback()
        }
    }, 'xml')
}

function waitElementAppear(selector, fn, queryInterval = 500, waitOnce = true) {
    var e = document.querySelector(selector)
    if (e) {
        console.log('找到元素', e)
        fn(e)
    }
    if (!e || !waitOnce) {
        setTimeout(() => waitElementAppear(selector, fn, queryInterval, waitOnce), queryInterval)
    }

}

function queryLands(canHarvest = false) {
    var lands = []
    for (var i = 1; i <= 40; i++) {
        var e = document.querySelector('span[id="' + i + '"]')
        var e2 = document.querySelector('span#_' + i + '>img.cropimg')
        if (e !== null && e.querySelector('img.jiesuoimg') == null) {
            if (!canHarvest || e2 !== null) {
                lands.push(i)
            }
        }
    }
    return lands
}

function do_sowing() {
    var lands = queryLands()
    var li_id = document.querySelector('#menudiv>ul.line>li').id
    if (li_id == null || !li_id.startsWith('depot_')) {
        setTimeout(do_sowing, 500)
        return
    }
    var depotid = li_id.split('_')[1]
    for (var id of lands) {
        ajaxget('plugin.php?id=gfarm:front&mod=gfarm_ajax&depotid=' + depotid + '&formhash=' +
            formhash.value + '&act=germajax&landid=' + id, '')
    }
    setTimeout(function () {
        if ($('div#itemsul').css('display') != 'none') {
            $('div#closemenu').click()
        }
    }, 1000)
}

function sowing() {
    if ($('div#itemsul').css('display') != 'none') {
        $('div#closemenu').click()
    }
    if ($('div#itemsul').html().trim()) {
        $('div#itemsul').html('')
    }
    ajaxget('plugin.php?id=gfarm:front&mod=gfarm_ajax&do=9', 'itemsul')
    waitElementAppear('div#itemsul>div#menudiv>ul.line>li', do_sowing)
}

function harvest() {
    var lands = queryLands(true)
    for (var id of lands) {
        ajaxget('plugin.php?id=gfarm:front&mod=gfarm_ajax&formhash=' + formhash.value +
            '&act=getcrop&landid=' + id, '')
    }
}
if (window.location.href.indexOf('/plugin.php?id=gfarm:front') >= 0) {
    $(document).ready(function () {
        waitElementAppear('div#usermenu', function () {
            $('div#usermenu').append(
                '<span id="sowing"><img src="/source/plugin/gfarm/img/ui/setgerm.png"/><font>全部种植</font></span>'
            )
            $('div#usermenu').append(
                '<span id="harvest"><img src="/source/plugin/gfarm/img/ui/hand.png"/><font>全部收获</font></span>'
            )
            $('div#usermenu>span#sowing').click(sowing)
            $('div#usermenu>span#harvest').click(harvest)
            $('#usermenu>span').css('width', '80px')
        })
    })
}