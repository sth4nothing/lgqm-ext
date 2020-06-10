$(document).ready(function () {
    $('#interval').val(localStorage.interval)
    $('#span').text(localStorage.interval + 's')
    $('#toggle').prop('checked', localStorage.host == 'lgqm.gq')
    $('#interval').change(function () {
        localStorage.interval = $('#interval').val()
        $('#span').text(localStorage.interval + 's')
    })
    $('#toggle').change(function () {
        localStorage.host = $('#toggle').prop('checked') ? 'lgqm.gq' : 'lgqm.top'
    })
    $('#go').click(function () {
        window.open('https://www.' + localStorage.host, '_blank')
    })
})