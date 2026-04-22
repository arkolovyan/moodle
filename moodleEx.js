//************ Styles ********
function appendStyleSheet(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}
function appendCSS(cssText) {
    const style = document.createElement('style');
    style.innerText = cssText;
    document.head.appendChild(style);
}
function setStyle(selector, style) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
el.style.cssText = style;
    }
}
function appendStyle(selector, style, value) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
el.style.cssText += style + ':' + value;
    }
}
function appendStyles(selector, styles) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
el.style.cssText += styles;
    }
}
//************ Tool Tips and PopUp dialog ********
function applyToolTips() {
    const elements = document.querySelectorAll('.tooltipOwner');
    for (const el of elements) {
        appendTipDiv(el, '.toolTipDiv');
        el.style.cssText = "color:magenta; cursor:pointer";
        el.onmouseenter = function () { showPopUp(el, '.toolTipDiv') };
        el.onmouseleave = function () { hidePopUp(el, '.toolTipDiv') };
    }
}
function applyPopUp() {
    const elements = document.querySelectorAll('.popupOwner');
    for (const el of elements) {
        appendTipDiv(el, '.popUpDiv');
        el.style.cssText = "color:forestgreen; cursor:pointer";
        el.setAttribute('title', 'Показать');
        el.onmouseenter = function () { el.style.color = 'limegreen'; el.style.textDecoration = 'underline' };
        el.onmouseleave = function () { el.style.color = 'forestgreen'; el.style.textDecoration = '' };
        el.onclick = function () { showPopUp(el, '.popUpDiv') };
    }
}
function appendTipDiv(elem, selector) {
    if (elem.querySelector(selector) !== null) return;
    var text_align = elem.getAttribute('data-align') || 'center',
        captionText = elem.getAttribute('data-caption'),
        captionCSS = "background-color:steelblue;color:white;padding:0 10px;border-bottom: 1px solid white;font-size:18pt;";
    var div = document.createElement('div');
    div.className = selector.split('.')[1];
    div.style.cssText = "position:fixed; z-index:999; display:none; color:blue; background-color:lavender; border:1px solid silver; border-radius:5px; padding:0";
    elem.appendChild(div);
    if (elem.hasAttribute('data-width'))
        div.style.width = elem.getAttribute('data-width');
    if (elem.classList.contains('popupOwner')) {
        var closeText = elem.getAttribute('data-closebutton') || '×';
        var btn = getContent(closeText);
        btn.style.cssText += captionCSS + 'float:right;';
        btn.title = 'Закрыть';
        btn.onmouseenter = function () { btn.style.backgroundColor = 'red' };
        btn.onmouseleave = function () { btn.style.backgroundColor = 'steelblue' };
        btn.onclick = function (e) { 
            e.stopPropagation(); 
            hidePopUp(elem, selector); 
        }
        div.appendChild(btn);
        captionText = captionText || ' ';
    }
    appendCaption(div, captionText, captionCSS);
    if (elem.hasAttribute('data-text')) div.appendChild(getContent(elem.getAttribute('data-text'), text_align, !elem.hasAttribute('data-width')))
    else if (elem.hasAttribute('data-html')) {
        div.style.textAlign = text_align;
        div.appendChild(getHtml(elem.getAttribute('data-html')));
    }
    else if (elem.hasAttribute('data-equation')) div.appendChild(getContent(elem.getAttribute('data-equation')))
    else if (elem.hasAttribute('data-url')) loadUrl(div, elem.getAttribute('data-url'))
    else if (elem.hasAttribute('data-childId')) {
        var child = document.getElementById(elem.getAttribute('data-childId'), text_align);
        child.style.display = 'inline-block';
        div.appendChild(child);
    }
    if (elem.hasAttribute('data-footer')) {
        var footer = getContent(elem.getAttribute('data-footer'));
        footer.style.cssText += "background-color:palegreen;color:black;padding:0 10px;";
        div.appendChild(footer);
    }
}
function loadUrl(div, url, keepStyles = 'true') {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (keepStyles)
                div.innerHTML = xmlHttp.responseText;
            else {
                var doc = new DOMParser().parseFromString(xmlHttp.responseText, 'text/html');
                div.innerHTML = doc.body.innerHTML;
            }
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}
function appendCaption(div, captionText, css) {
    if (!captionText) return;
    var caption = getContent(captionText);
    caption.style.cssText += css;
    div.appendChild(caption);
}
function getHtml(html) {
    var span = document.createElement('span');
    span.innerHTML = html;
    return span;
}
function getContent(text, text_align = 'center', nowrap = false) {
    var span = document.createElement('span');
    span.style.cssText = 'display:block;padding:5px;margin:0;';
    span.style.textAlign = text_align;
    if (nowrap) span.style.whiteSpace = 'nowrap';
    span.innerText = text;
    return span
}
function showPopUp(elem, selector) {
    var div = elem.querySelector(selector);
    if (div == null) return;
    div.style.display = 'inline';
    div.title = '';
    if (selector == '.popUpDiv') {
        centerDialog(div);
        return;
    }
    var rc = elem.getBoundingClientRect(),
        popTop = rc.top - div.offsetHeight - 5,
        popLeft = rc.left + (rc.width - div.clientWidth) / 2,
        w = document.documentElement.clientWidth;
    if (popLeft < 5) popLeft = 5;
    else if (popLeft + div.clientWidth > w - 5) popLeft = w - div.clientWidth - 5;
    if (popTop < 0) popTop = rc.bottom + elem.clientHeight + 5
    div.style.left = popLeft + 'px';
    div.style.top = popTop + 'px';
}
function hidePopUp(elem, selector) {
    var div = elem.querySelector(selector);
    if (div) div.style.display = 'none';
}
function centerDialog(box) {
    box.style.top = '50%';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, -50%)';
}
//***************************************
//************ Test questions UI ********
//***************************************
function randomId(length = 6) {
    return Math.random().toString(36).substring(2, length + 2);
};
function numericQuestion(qType) {
    const answer = content.querySelector('span.answer');
    if (!answer) return false;
    if (qType == 'lаtitude') applyPositionInput(answer, 'N', 'S')
    else if (qType == 'longitude') applyPositionInput(answer, 'E', 'W')
    else if (qType == 'deltaLat') applyPositionInput(answer, 'к N', 'к S')
    else if (qType == 'deltaLon') applyPositionInput(answer, 'к E', 'к W')
    else if (qType == 'time') applyTimeInput(answer)
    else return false;
    return true;
}
function clozeQuestion() {
    const subquestions = content.querySelectorAll('span.subquestion');
    if (subquestions.length == 0) return false;
    var n = 0;
    for (const q of subquestions) {
        if (q.parentNode.className == 'latitude') applyPositionInput(q, 'N', 'S')
        else if (q.parentNode.className == 'longitude') applyPositionInput(q, 'E', 'W')
        else if (q.parentNode.className == 'time') applyTimeInput(q)
        else n += 1;
    }
    return (n < subquestions.length);
}
//Position input
//Правильный ответ должен быть в градусах с плавающей точкой
function applyPositionInput(answerContainer, positive, negative) {
    var input = answerContainer.querySelector('input'),
        select = document.createElement('select'),
        idSuffix = '_' + randomId();
    select.id = 'latlon_sgn' + idSuffix;
    select.className += 'select form-select d-inline-block';
    select.add(new Option(positive, '1'));
    select.add(new Option(negative, '-1'));
    input.insertAdjacentHTML('beforebegin', "<input id='deg_input" + idSuffix +
"' type='number' maxlength='3' min='0' max='180' inputmode='numeric' style='width:80px;text-align:right;' class='form-control d-inline'>");
    input.insertAdjacentHTML('beforebegin', "<span style='line-height:4px;vertical-align:top;'>°</span>");
    input.insertAdjacentHTML('beforebegin', "<input id='min_input" + idSuffix +
"' type='number' maxlength='4' min='0' max='60' inputmode='decimal' step='0.1' style='width:80px;text-align:right;' class='form-control d-inline'>");
    input.insertAdjacentHTML('beforebegin', "<span style='line-height:4px;vertical-align:top;'>\'</span>");
    input.parentNode.insertBefore(select, input);
    input.style.setProperty('display', 'none', 'important');
    var input_deg = content.querySelector('#deg_input' + idSuffix),
        input_min = content.querySelector('#min_input' + idSuffix),
        select = content.querySelector('#latlon_sgn' + idSuffix);
    formatCorrectAnswer(answerContainer, positive, negative);
    if (input.value) {
        var v = parseFloat(input.value.replace(',', '.'));
        if (!isNaN(v)) {
            var sgn = (v < 0) ? -1 : 1;
            v = Math.abs(v);
            input_deg.value = Math.floor(v);
            var mins = Math.round((v - input_deg.value) * 600) / 10;
            if (mins < 10) mins = '0' + mins;
            input_min.value = mins;
            select.value = sgn;
        }
    }
    if (input.getAttribute('readonly') || input.disabled) {
        input_deg.disabled = true;
        input_min.disabled = true;
        select.disabled = true;
    }
    const form = content.closest('#responseform');
    form.addEventListener('submit', (event) => {
        var d = parseInt(input_deg.value),
            m = parseFloat(input_min.value.replace(',', '.')) / 60,
            degs = d + m;
        if (!isNaN(degs)) degs *= parseInt(select.value);
        input.value = degs;
    });
}
function applyPositionFormat() {
    const latitudes = content.querySelectorAll('span.latitude'),
        longitudes = content.querySelectorAll('span.longitude');
    for (const lat of latitudes) {
        lat.innerText = formatLatitude(lat.innerText);
    };
    for (const lon of longitudes) {
        lon.innerText = formatLongitude(lon.innerText);
    };
}
function formatPosition(value, positive, negative) {
    var v = parseFloat(value.replace(',', '.'));
    var sgn = (v < 0) ? negative : positive;
    v = Math.abs(v);
    var deg = Math.floor(v)
    var mins = Math.round((v - deg) * 600) / 10;
    if (mins < 10) mins = '0' + mins;
    if ((mins + '').length < 3) mins = mins + '.0';
    return deg + '°' + mins + '\'' + sgn;
}
function formatLatitude(value) {
    return formatPosition(value, 'N', 'S');
}
function formatLongitude(value) {
    return formatPosition(value, 'E', 'W');
}
function formatCorrectAnswer(answerContainer, positive, negative) {
    var popUp = answerContainer.querySelector('a');
    if (popUp) {
        var bsContent = popUp.getAttribute('data-bs-content'),
            start = bsContent.indexOf(':') + 1,
            end = bsContent.indexOf('<', start),
            str_val = bsContent.substring(start, end),
            val = parseFloat(str_val);
        popUp.setAttribute('data-bs-content', bsContent.replace(str_val, ' ' + formatPosition(str_val, positive, negative)));
    } else {
        var rightAnswer = content.querySelector('div.rightanswer');
        if (rightAnswer) {
            var s = rightAnswer.innerText,
                pos = s.indexOf(':') + 2;
            rightAnswer.innerText = s.substring(0, pos) + formatPosition(s.substring(pos), positive, negative);
        }
    }
}
//************ Directions input ********
var rhumbs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
    quoters = ['NE', 'SE', 'SW', 'NW'],
    EW = ['E', 'W'];
function showSign(id) {
    var value = parseFloat(content.querySelector('#' + id + '_hidden').value);
    if (value > 0) content.querySelector('#' + id).innerText = '+';
}
function replaceHidden(id, values) {
    var value = content.querySelector('#' + id + '_hidden').value;
    content.querySelector('#' + id).innerText = values[value];
}
function showInputSign() {
    var input = content.querySelector('span.answer input');
    if (!input.getAttribute('readonly')) {
        var v = input.value;
        if (v && v.indexOf('-') != 0) input.value = '+' + v;
    }
}
function showCorrectAnswerSign() {
    var div = content.querySelector('div.rightanswer');
    if (div) {
        var text = div.innerText;
        if (text.indexOf('-') == -1) div.innerText = text.replace(': ', ': +');
    }
}
function replaceNegativeText(positive, negative) {
    var div = content.querySelector('div.rightanswer');
    if (div) {
        var text = div.innerText;
        if (text.indexOf('-') > -1) div.innerText = text.replace('-', '').replace(positive, negative);
    }
}
function replaceNegativeInput(negative) {
    var input = content.querySelector('span.answer input');
    if (!input.readonly) {
        var v = input.value;
        if (v.indexOf('-') == 0) {
            input.value = v.substring(1);
            content.querySelector('span.answer select').value = negative;
        }
    }
}
function nearestRhumb(val, rhumbs) {
    return rhumbs[Math.round(((360 + val) % 360) * rhumbs.length / 360)];
}
//************ Time input ********
//Правильный ответ должен быть в часах с плавающей точкой
function formatTime(value, separator = ':') {
    var v = parseFloat(value.toString().replace(",", "."));
    if (isNaN(v) || v < 0 || v > 24) return value;
    var hours = Math.floor(v),
        mins = Math.round((v - hours) * 60);
    if (hours < 10) hours = '0' + hours;
    if (mins < 10) mins = '0' + mins;
    return hours + separator + mins;
}
function parseTime(value) {
    v = parseFloat(value.replace(",", ".").replace(":", "."));
    if (isNaN(v) || v < 0 || v > 24) return value;
    var hours = Math.floor(v),
        mins = Math.round((v - hours) * 100);
    return hours + mins / 60;
}
function applyTimeInput(answerContainer) {
    var input = answerContainer.querySelector('input'),
        rightAnswer = content.querySelector('div.rightanswer'),
        idSuffix = '_' + randomId();
    input.insertAdjacentHTML('beforebegin', "<input id='time_input" + idSuffix + "' type='time' class='form-control d-inline' style='width:auto'>");
    input.style.setProperty('display', 'none', 'important');
    var inp = content.querySelector('#time_input' + idSuffix);
    if (input.value) inp.value = formatTime(input.value, ':');
    const form = content.closest('#responseform');
    form.addEventListener('submit', (event) => {
        input.value = parseTime(inp.value);
    });
    if (rightAnswer) {
        var s = rightAnswer.innerText,
            pos = s.indexOf(':') + 2;
        rightAnswer.innerText = s.substring(0, pos) + formatTime(s.substring(pos), ':');
    }
}
