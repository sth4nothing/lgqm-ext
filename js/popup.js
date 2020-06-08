var interval = document.getElementById('interval')
var span = document.getElementById('span')
var toggle = document.getElementById('toggle')
window.onload = function () {
    if (localStorage.interval !== undefined) {
        interval.value = localStorage.interval
    }
    if (localStorage.host !== undefined) {
        toggle.checked = localStorage.host == 'lgqm.gq'
    }
    interval.onchange = function () {
        span.textContent = interval.value + 's'
        localStorage.interval = interval.value
    }
    toggle.onchange = function () {
        localStorage.host = toggle.checked ? 'lgqm.gq' : 'lgqm.top'
    }
}