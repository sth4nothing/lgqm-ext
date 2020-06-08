(function () {
    var status = {
        last_sum: -1,
    }
    const scheme = 'https://www.'
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
            console.log("未登录")
        }
    }

    function fail (xhr, stat, e) {
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
        setTimeout(query, Math.min(Number(localStorage.interval), 5) * 1000)
    }
    setTimeout(query, Math.min(Number(localStorage.interval), 5) * 1000)
})()