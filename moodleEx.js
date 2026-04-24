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
    let text_align = elem.getAttribute('data-align') || 'center',
        captionText = elem.getAttribute('data-caption'),
        captionCSS = "background-color:steelblue;color:white;padding:0 10px;border-bottom: 1px solid white;font-size:18pt;";
    let div = document.createElement('div');
    div.className = selector.split('.')[1];
    div.style.cssText = "position:fixed; z-index:999; display:none; color:blue; background-color:lavender; border:1px solid silver; border-radius:5px; padding:0";
    elem.appendChild(div);
    if (elem.hasAttribute('data-width'))
        div.style.width = elem.getAttribute('data-width');
    if (elem.classList.contains('popupOwner')) {
        let closeText = elem.getAttribute('data-closebutton') || '×',
            btn = getContent(closeText);
        btn.style.cssText += captionCSS + 'float:right;';
        btn.title = 'Закрыть';
        btn.onmouseenter = function () { btn.style.backgroundColor = 'red' };
        btn.onmouseleave = function () { btn.style.backgroundColor = 'steelblue' };
        btn.onclick = function (e) { e.stopPropagation(); hidePopUp(elem, selector); }
        div.appendChild(btn);
        captionText = captionText || ' ';
    }
    appendCaption(div, captionText, captionCSS);
    if (elem.hasAttribute('data-text')) div.appendChild(getContent(elem.getAttribute('data-text'), text_align, !elem.hasAttribute('data-width')));
    else if (elem.hasAttribute('data-html')) {
        div.style.textAlign = text_align;
        div.appendChild(getHtml(elem.getAttribute('data-html')));
    }
    else if (elem.hasAttribute('data-equation')) div.appendChild(getContent(elem.getAttribute('data-equation')));
    else if (elem.hasAttribute('data-url')) loadUrl(div, elem.getAttribute('data-url'));
    else if (elem.hasAttribute('data-childId')) {
        let child = document.getElementById(elem.getAttribute('data-childId'), text_align);
        child.style.display = 'inline-block';
        div.appendChild(child);
    }
    if (elem.hasAttribute('data-footer')) {
        let footer = getContent(elem.getAttribute('data-footer'));
        footer.style.cssText += "background-color:palegreen;color:black;padding:0 10px;";
        div.appendChild(footer);
    }
}
function loadUrl(div, url, keepStyles = 'true') {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (keepStyles)
                div.innerHTML = xmlHttp.responseText;
            else {
                let doc = new DOMParser().parseFromString(xmlHttp.responseText, 'text/html');
                div.innerHTML = doc.body.innerHTML;
            }
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}
function appendCaption(div, captionText, css) {
    if (!captionText) return;
    let caption = getContent(captionText);
    caption.style.cssText += css;
    div.appendChild(caption);
}
function getHtml(html) {
    let span = document.createElement('span');
    span.innerHTML = html;
    return span;
}
function getContent(text, text_align = 'center', nowrap = false) {
    let span = document.createElement('span');
    span.style.cssText = 'display:block;padding:5px;margin:0;';
    span.style.textAlign = text_align;
    if (nowrap) span.style.whiteSpace = 'nowrap';
    span.innerText = text;
    return span
}
function showPopUp(elem, selector) {
    let div = elem.querySelector(selector);
    if (div == null) return;
    div.style.display = 'inline';
    div.title = '';
    if (selector == '.popUpDiv') {
        centerDialog(div);
        return;
    }
    let rc = elem.getBoundingClientRect(),
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
    let div = elem.querySelector(selector);
    if (div) div.style.display = 'none';
}
function centerDialog(box) {
    box.style.top = '50%';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, -50%)';
}
//***************************************
//************ Test questions UI ********
var deg_input_html = "<input id='deg_input_idSuffix' type='number' maxlength='3' min='0' max='180' inputmode='numeric' style='width:80px;text-align:right;' class='form-control d-inline'>",
    min_input_html = "<input id='min_input_idSuffix' type='number' maxlength='4' min='0' max='60' inputmode='decimal' step='0.1' style='width:80px;text-align:right;' class='form-control d-inline'>",
    time_input_html = "<input id='time_input_idSuffix' type='time' class='form-control d-inline' style='width:auto'>",
    signed_input_html = "<input id='signed_input_idSuffix' class='form-control d-inline' style='width:auto'>";
//var deviation_table = [1.8, 1.1, 0.3, -0.5, -1.3, -2.1, -2.8, -3.4, -3.8, -4.1, -4.2, -4.1, -3.9, -3.5, -3, -2.4, -1.7, -1, -0.3, 0.4, 1.1, 1.6, 2.1, 2.6, 2.9, 3.2, 3.4, 3.6, 3.7, 3.8, 3.8, 3.7, 3.5, 3.3, 2.9, 2.4];
function randomId(length = 6) {
    return Math.random().toString(36).substring(2, length + 2);
};
function numericQuestion(type) {
    const answer = content.querySelector('span.answer');
    if (!answer) return false;
    if (isPosition(type)) applyPositionInput(answer, type)
    else if (type == 'time') applyTimeInput(answer)
    else if (type == 'signed') applySignedInput(answer)
    else return false;
    return true;
}
function clozeQuestion() {
    const subquestions = content.querySelectorAll('span.subquestion');
    if (subquestions.length == 0) return false;
    let n = 0;
    for (const q of subquestions) {
        if (q.parentNode.className == 'latitude') applyPositionInput(q, 'latitude')
        else if (q.parentNode.className == 'longitude') applyPositionInput(q, 'longitude')
        else if (q.parentNode.className == 'time') applyTimeInput(q)
        else if (q.parentNode.className == 'signed') applySignedInput(q)
        else n += 1;
    }
    return (n < subquestions.length);
}
function isPosition(type) {
    const arr = ['lаtitude', 'longitude', 'deltaLat', 'deltaLon'];
    return arr.indexOf(type) !== -1;
}
function isDirection(type) {
    const arr = ['quoter', 'semiN', 'semiS', 'rhumb', 'signed'];
    return arr.indexOf(type) !== -1;
}
function positionLetter(type) {
    if (type == 'lаtitude') return { 'positive': 'N', 'negative': 'S' }
    else if (type == 'longitude') return { 'positive': 'E', 'negative': 'W' }
    else if (type == 'deltaLat') return { 'positive': 'к N', 'negative': 'к S' }
    else if (type == 'deltaLon') return { 'positive': 'к E', 'negative': 'к W' }
}
//************* Formatting ************
function formatValues(tag, className) {
    const elements = content.querySelectorAll(tag + '.' + className);
    for (const el of elements) {
        el.innerText = formatValue(el.innerText, className);
    }
}
function formatValue(value, type) {
    if (isPosition(type)) return formatPosition(value, type)
    else if (isDirection(type)) return formatDirection(value, type)
    else if (type == 'time') return formatTime(value);
}
function formatPosition(value, type) {
    if (!isPosition(type)) return;
    let letter = positionLetter(type),
        v = parseFloat(value.replace(',', '.')),
        sgn = (v < 0) ? letter.negative : letter.positive;
    v = Math.abs(v);
    let deg = Math.floor(v),
        mins = Math.round((v - deg) * 600) / 10;
    if (mins < 10) mins = '0' + mins;
    if ((mins + '').length < 3) mins = mins + '.0';
    return deg + '°' + mins + '\'' + sgn;
}
function formatTime(value, separator = ':') {
    let v = parseFloat(value.toString().replace(",", "."));
    if (isNaN(v) || v < 0 || v > 24) return value;
    let hours = Math.floor(v),
        mins = Math.round((v - hours) * 60);
    if (hours < 10) hours = '0' + hours;
    if (mins < 10) mins = '0' + mins;
    return hours + separator + mins;
}
function formatDirection(value, type) {
    let v = parseFloat(value.replace(',', '.')); 
    if (type == 'quoter') {
        let n = Math.floor(v / 90),
            angle = (n == 0) ? v : (n == 1) ? 180 - v : (n == 2) ? v - 180 : 360 - v;
        return angle + quoters[n];
    }
    else if (type == 'semiN') return 'N' + (v > 180) ? (360 - v) + 'W' : v + 'E'
    else if (type == 'semiS') return 'S' + (v > 180) ? (v - 180) + 'W' : (180 - v) + 'E'
    else if (type == 'signed') return (v > 0) ? '+' + v : v + '';
    else if (type == 'rhumb') return rhumbs[v];
}
function formatCorrectAnswer(answerContainer, type) {
    const popUp = answerContainer.querySelector('a');
    if (popUp) {
        let bsContent = popUp.getAttribute('data-bs-content'),
            start = bsContent.indexOf(':') + 1,
            end = bsContent.indexOf('<', start),
            str_val = bsContent.substring(start, end);
        popUp.setAttribute('data-bs-content', bsContent.replace(str_val, ' ' + formatValue(str_val, type)));
    } else {
        const rightAnswer = content.querySelector('div.rightanswer');
        if (rightAnswer) {
            let s = rightAnswer.innerText,
                pos = s.indexOf(':') + 2;
            rightAnswer.innerText = s.substring(0, pos) + formatValue(s.substring(pos), type);
        }
    }
}
//************* Replace standard input ************
function applyPositionInput(answerContainer, type) {
    if (!isPosition(type)) return;
    const input = answerContainer.querySelector('input'),
        select = document.createElement('select'),
        idSuffix = randomId(),
        letter = positionLetter(type);
    select.id = 'latlon_sgn_' + idSuffix;
    select.className += 'select form-select d-inline-block';
    select.add(new Option(letter.positive, '1'));
    select.add(new Option(letter.negative, '-1'));
    input.insertAdjacentHTML('beforebegin', deg_input_html.replace('idSuffix',idSuffix));
    input.insertAdjacentHTML('beforebegin', "<span style='line-height:4px;vertical-align:top;'>°</span>");
    input.insertAdjacentHTML('beforebegin', min_input_html.replace('idSuffix', idSuffix));
    input.insertAdjacentHTML('beforebegin', "<span style='line-height:4px;vertical-align:top;'>\'</span>");
    input.parentNode.insertBefore(select, input);
    input.style.setProperty('display', 'none', 'important');
    let input_deg = content.querySelector('#deg_input_' + idSuffix),
        input_min = content.querySelector('#min_input_' + idSuffix);
    formatCorrectAnswer(answerContainer, type);
    if (input.value) {
        let v = parseFloat(input.value.replace(',', '.'));
        if (!isNaN(v)) {
            let sgn = (v < 0) ? -1 : 1;
            v = Math.abs(v),
                mins = Math.round((v - input_deg.value) * 600) / 10;
            input_deg.value = Math.floor(v);
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
    form.addEventListener('submit', function() {
        let d = parseInt(input_deg.value),
            m = parseFloat(input_min.value.replace(',', '.')) / 60,
            degs = d + m;
        if (!isNaN(degs)) degs *= parseInt(select.value);
        input.value = degs;
    });
}
function applyTimeInput(answerContainer) {
    let input = answerContainer.querySelector('input'),
        idSuffix = randomId();
    input.insertAdjacentHTML('beforebegin', time_input_html.replace('idSuffix', idSuffix));
    input.style.setProperty('display', 'none', 'important');
    let inp = content.querySelector('#time_input_' + idSuffix);
    if (input.value) inp.value = formatTime(input.value, ':');
    const form = content.closest('#responseform');
    if (input.getAttribute('readonly') || input.disabled) inp.disabled = true;
    form.addEventListener('submit', function () {
        let v = parseFloat(inp.value.replace(",", ".").replace(":", "."));
        if (isNaN(v) || v < 0 || v > 24) return;
        let hours = Math.floor(v),
            mins = Math.round((v - hours) * 100);
        input.value = hours + mins / 60;
    });
    formatCorrectAnswer(answerContainer, 'time');
}
function applySignedInput(answerContainer) {
    let input = answerContainer.querySelector('input'),
        idSuffix = randomId();
    input.insertAdjacentHTML('beforebegin', signed_input_html.replace('idSuffix', idSuffix));
    input.style.setProperty('display', 'none', 'important');
    let inp = content.querySelector('#signed_input_' + idSuffix);
    if (input.value) inp.value = input.value;
    if (input.getAttribute('readonly') || input.disabled) inp.disabled = true;
    const form = content.closest('#responseform');
    form.addEventListener('submit', function (event) {
        let submitter = event.submitter;
        if (submitter.name == 'finish') {
            let v = parseFloat(inp.value.replace(",", "."));
            if (isNaN(v)) input.value = inp.value
            else if (v > 0 && !inp.value.starsWith('+')) input.value = 'a' + inp.value;
            else input.value = inp.value;
        }
    });
    formatCorrectAnswer(answerContainer, 'signed');
}

//************ Directions input ********
var rhumbs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
    quoters = ['NE', 'SE', 'SW', 'NW'],
    EW = ['E', 'W'];

function createDeviationTable(tag, className) {
    var table = '<table width="auto" cellspacing="2" cellpadding = "2" ><thead style="text-align: center;"><tr>';
    for (i = 0; i < 4; i++) {
        table += '<th>KK</th><th>δ</th>';
    }
    table += '</tr></thead><tbody style="text-align: right;">';
    for (i = 0; i < 9; i++) {
        table += '<tr>'
        for (j = 0; j < 4; j++) {
            var angle = j * 90 + i * 10,
                deviation = getDeviation(angle);
            table += '<td>' + angle + '</td><td>' + deviation.toFixed(1) + '</td>';
        }
        table += '</tr>'
    }
    table += '</tbody></table>';
    let owner=document.querySelector(tag+'.'+className)
    owner.innerHTML = table;
}
function getDeviation(kk) {
    kk = kk * Math.PI / 180;
    var x = 0.2625 - 3.8607 * Math.sin(kk) + 1.012 * Math.cos(kk) + 0.075 * Math.sin(2 * kk) + 0.5 * Math.cos(2 * kk)
    return Math.round(x * 10) / 10;
}
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
