const $ = require('jquery')
var config = require('./config')

function remove(e) {
    var userId = $(e.target).parent().siblings().text()
    var blockList = new Set(JSON.parse(localStorage.blockList))
    blockList.delete(userId)
    localStorage.blockList = JSON.stringify(Array.from(blockList))
    $(e.target).parent().parent().hide()
}

$(function () {
    $('#interval').val(localStorage.interval)
    $('#span').text(localStorage.interval + 's')
    $('#toggle').prop('checked', localStorage.host == 'lgqm.gq')
    var blockList = JSON.parse(localStorage.blockList)
    for (var userId of blockList) {
        $('<tr><td>{userId}</td><td><input type="button" value="删除"></td></tr>'.replace('{userId}', '' + userId)).insertBefore(
            $('#add').parent().parent()
        ).find('input[type="button"]').on('click', remove)
    }
    $('#interval').on('change', function () {
        localStorage.interval = $('#interval').val()
        $('#span').text(localStorage.interval + 's')
    })
    $('#toggle').on('change', function () {
        localStorage.host = $('#toggle').prop('checked') ? 'lgqm.gq' : 'lgqm.top'
    })
    $('#go').on('click', function () {
        window.open('https://www.' + localStorage.host, '_blank')
    })
    $('#wiki').on('keypress', function (e) {
        var data = $('#wiki').val()
        if (data && e && e.code) {
            e.preventDefault()
            if (!e.ctrlKey)
                window.open('https://lgqm.huijiwiki.com/index.php?profile=all&fulltext=1&search=' + encodeURI(data), '_blank')
            else
                window.open('https://lgqm.huijiwiki.com/index.php?profile=all&search=' + encodeURI(data), '_blank')
        }

    })
    $('#add').on('click', function () {
        if (Number($('#userId').val()) > 0) {
            var userId = '' + Number($('#userId').val())
            var blockList = new Set(JSON.parse(localStorage.blockList))
            blockList.add(userId)
            localStorage.blockList = JSON.stringify(Array.from(blockList))
            $('<tr><td>{userId}</td><td><input type="button" value="删除"></td></tr>'.replace('{userId}', userId)).insertBefore(
                $('#add').parent().parent()).find('input[type="button"]').on('click', remove)
            $('#userId').val('')
            $('#userId').trigger('focus')
        } else {
            alert('无效的ID')
        }
    })
})
exports.$ = $
exports.config = config