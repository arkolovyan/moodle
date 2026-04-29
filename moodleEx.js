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
let deg_input_html = "<input id='deg_input_idSuffix' type='number' maxlength='3' min='0' max='180' inputmode='numeric' style='width:80px;text-align:right;' class='form-control d-inline'>",
    min_input_html = "<input id='min_input_idSuffix' type='number' maxlength='4' min='0' max='60' inputmode='decimal' step='0.1' style='width:80px;text-align:right;' class='form-control d-inline'>",
    time_input_html = "<input id='time_input_idSuffix' type='time' class='form-control d-inline' style='width:auto'>",
    input_html = "<input id='signed_input_idSuffix' size='30' type='text' style='width:30%; text-align: right' class='form-control d-inline'>",
    rhumbs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
    quoters = ['NE', 'SE', 'SW', 'NW'];
function randomId(length = 6) {
    return Math.random().toString(36).substring(2, length + 2);
};
function getFloat(value) {
    return parseFloat(('' + value).replace(',', '.'));
}
function normalizeAngle(value) {
    return (360 + value) % 360
}
function numericQuestion(type, units = '') {
    const answer = content.querySelector('span.answer');
    if (!answer) return false;
    if (isPosition(type)) applyPositionInput(answer, type)
    else if (isDirection(type)) applyDirectionInput(answer, type, units)
    else if (type == 'time') applyTimeInput(answer)
    else if (type == 'signed') applySignedInput(answer, units)
    else return false;
    return true;
}
function clozeQuestion(units) {
    const subquestions = content.querySelectorAll('span.subquestion');
    if (subquestions.length == 0) return false;
    let n = 0;
    for (const q of subquestions) {
        let type = q.parentNode.className,
            unit = '';
        if (units && (type in units)) unit = units[type];
        if (isPosition(type)) applyPositionInput(q, type)
        else if (isDirection(type)) applyDirectionInput(q, type, unit)
        else if (type == 'time') applyTimeInput(q)
        else if (type == 'signed') applySignedInput(q, unit)
        else n += 1;
    }
    return (n < subquestions.length);
}
function isPosition(type) {
    const arr = ['latitude', 'longitude', 'deltaLat', 'deltaLon'];
    return arr.indexOf(type) > -1;
}
function isDirection(type) {
    const arr = ['circular', 'quoter', 'semiN', 'semiS', 'rhumb', 'nearestRhumb', 'ew'];
    return arr.indexOf(type) !== -1;
}
function positionLetter(type) {
    if (type == 'latitude') return { 'positive': 'N', 'negative': 'S' }
    else if (type == 'longitude') return { 'positive': 'E', 'negative': 'W' }
    else if (type == 'deltaLat') return { 'positive': 'к N', 'negative': 'к S' }
    else if (type == 'deltaLon') return { 'positive': 'к E', 'negative': 'к W' };
}
function getDirectionFormat(type, value) {
    let v = getFloat(value);
    if (!isDirection(type) || isNaN(v)) return { 'prefix': '', 'value': NaN, 'suffix': '' + value, 'options': [] };
    if (type != 'ew') v = normalizeAngle(v);
    switch (type) {
        case 'circular':
            return { 'prefix': '', 'value': v, 'suffix': '', 'options': [] };
        case 'quoter':
            let n = Math.floor(v / 90),
                angle = (n == 0) ? v : (n == 1) ? 180 - v : (n == 2) ? v - 180 : 360 - v;
            return { 'prefix': '', 'value': angle, 'suffix': quoters[n], 'options': quoters };
        case 'semiN':
            if (v > 180) return { 'prefix': 'N', 'value': 360 - v, 'suffix': 'W', 'options': ['E','W'] }
            else return { 'prefix': 'N', 'value': v, 'suffix': 'E', 'options': ['E', 'W'] };
        case 'semiS':
            if (v > 180) return { 'prefix': 'S', 'value': v - 180, 'suffix': 'W', 'options': ['E', 'W'] }
            else return { 'prefix': 'S', 'value': 180 - v, 'suffix': 'E', 'options': ['E', 'W'] };
        case 'rhumb':
            return { 'prefix': '', 'value': v, 'suffix': rhumbs[v], 'options': rhumbs };
        case 'nearestRhumb':
            let rhumbNumber = Math.round(v * rhumbs.length / 360);
            return { 'prefix': '', 'value': rhumbNumber, 'suffix': rhumbs[rhumbNumber], 'options': rhumbs };
        case 'ew':
            return { 'prefix': '', 'value': Math.abs(v), 'suffix': (v < 0) ? 'W' : 'E', 'options': ['E', 'W'] };
        default:
            return { 'prefix': '', 'value': NaN, 'suffix': '' + value, 'options': [] };
    }
}
function parseDirection(type, prefixVal, value, suffixVal) {
    let v = getFloat(value);
    if (!isDirection(type) || isNaN(v)) return value;
    switch (type) {
        case 'circular': return v;
        case 'quoter': return (suffixVal == 0) ? v : (suffixVal == 1) ? 180 - v : (suffixVal == 2) ? v + 180 : 360 - v;
        case 'semiN':
        case 'semiS':
            if (prefixVal == 1) return (360 + v * suffixVal) % 360
            else if (prefixVal == -1) return (180 - v * suffixVal);
        case 'rhumb':
        case 'nearestRhumb': return suffixVal * 22.5;
        case 'ew': return v * suffixVal;
        default: return value;
    }
}
//************* Formatting ************
function formatValues(tag, className, units = '') {
    const elements = content.querySelectorAll(tag + '.' + className);
    for (const el of elements) {
        el.innerText = formatValue(el.innerText, className, units);
    }
}
function formatValue(value, type, units = '') {
    if (isPosition(type)) return formatPosition(value, type)
    else if (isDirection(type)) return formatDirection(value, type, units)
    else if (type == 'signed') return formatSigned(value, units);
    else if (type == 'time') return formatTime(value)
    else return type;
}
function formatFloat(value, fractionDigits = 4) {
    let str_val = ('' + value).replace(',', '.'),
        v = parseFloat(str_val);
    if (isNaN(v)) return str_val;
    let n = Math.pow(10, fractionDigits)
    return '' + Math.round(v * n) / n;
}
function formatPosition(value, type) {
    if (!isPosition(type)) return '?' + value;
    let letter = positionLetter(type),
        v = getFloat(value),
        sgn = (v < 0) ? letter.negative : letter.positive;
    v = Math.abs(v);
    let deg = Math.floor(v),
        mins = Math.round((v - deg) * 600) / 10;
    if (mins < 10) mins = '0' + mins;
    if ((mins + '').length < 3) mins = mins + '.0';
    return deg + '°' + mins + '\'' + sgn;
}
function formatTime(value, separator = ':') {
    let v = getFloat(value);
    if (isNaN(v) || v < 0 || v > 24) return '' + value;
    let hours = Math.floor(v),
        mins = Math.round((v - hours) * 60);
    if (hours < 10) hours = '0' + hours;
    if (mins < 10) mins = '0' + mins;
    return hours + separator + mins;
}
function formatDirection(value, type, units = '') {
    let f = getDirectionFormat(type, value);
    if (isNaN(f.value)) return f.suffix;
    if (type == 'rhumb' || type == 'nearestRhumb') return f.suffix;
    return f.prefix + formatFloat(f.value) + units + f.suffix;
}
function formatSigned(value, units = '') {
    let v = getFloat(value);
    if (isNaN(v)) return '' + value;
    return (v > 0) ? '+' + formatFloat(v) + units : formatFloat(v) + units;
}
function formatNumericSpans() {
    for (el of content.querySelectorAll('span.numeric')) {
        el.innerText = formatFloat(el.innerText);
    }
}
function formatWindAlpha(courseClass, alphaClass) {
    let elCourse = document.querySelector('.' + courseClass),
        elAlpha = document.querySelector('.' + alphaClass),
        course = parseInt(elCourse.innerText),
        wind_alpha = parseInt(elAlpha.innerText),
        wind_dir = normalizeAngle((wind_alpha < 0) ? course + 90 : course - 90),
        rhumb = rhumbs[Math.round(wind_dir * rhumbs.length / 360)];
    elAlpha.innerText = rhumb + ' α = ' + Math.abs(wind_alpha);
}
function formatCorrectAnswer(answerContainer, type, units = '') {
    const popUp = answerContainer.querySelector('a');
    if (popUp) {
        let bsContent = popUp.getAttribute('data-bs-content'),
            start = bsContent.indexOf(':') + 1,
            end = bsContent.indexOf('<', start),
            str_val = bsContent.substring(start, end);
        popUp.setAttribute('data-bs-content', bsContent.replace(str_val, ' ' + formatValue(str_val, type, units)));
    } else {
        const rightAnswer = content.querySelector('div.rightanswer');
        if (rightAnswer) {
            let s = rightAnswer.innerText,
                pos = s.indexOf(':') + 2;
            rightAnswer.innerText = s.substring(0, pos) + formatValue(s.substring(pos), type, units);
        }
    }
}
//************* Replace standard input ************
function applyPositionInput(answerContainer, type) {
    if (!isPosition(type)) return;
    let input = answerContainer.querySelector('input'),
        select = document.createElement('select'),
        idSuffix = randomId(),
        letter = positionLetter(type);
    select.id = 'latlon_sgn_' + idSuffix;
    select.className += 'select form-select d-inline-block';
    select.add(new Option(letter.positive, '1'));
    select.add(new Option(letter.negative, '-1'));
    input.insertAdjacentHTML('beforebegin', deg_input_html.replace('idSuffix', idSuffix));
    input.insertAdjacentHTML('beforebegin', "<span style='line-height:10px;vertical-align:top;'>°</span>");
    input.insertAdjacentHTML('beforebegin', min_input_html.replace('idSuffix', idSuffix));
    input.insertAdjacentHTML('beforebegin', "<span style='line-height:10px;vertical-align:top;'>\'</span>");
    input.parentNode.insertBefore(select, input);
    input.style.setProperty('display', 'none', 'important');
    let input_deg = content.querySelector('#deg_input_' + idSuffix),
        input_min = content.querySelector('#min_input_' + idSuffix);
    if (input.value) {
        let v = getFloat(input.value);
        if (!isNaN(v)) {
            let sgn = (v < 0) ? -1 : 1;
            v = Math.abs(v)
            let deg = Math.floor(v),
                mins = Math.round((v - deg) * 600) / 10;
            if (mins < 10) mins = '0' + mins;
            input_deg.value = deg;
            input_min.value = mins;
            select.value = sgn;
        }
    }
    if (input.getAttribute('readonly') || input.disabled) {
        input_deg.disabled = true;
        input_min.disabled = true;
        select.disabled = true;
    }
    formatCorrectAnswer(answerContainer, type);
    const form = content.closest('#responseform');
    form.addEventListener('submit', function () {
        let d = parseInt(input_deg.value),
            m = getFloat(input_min.value) / 60,
            degs = d + m;
        if (!isNaN(degs)) degs *= parseInt(select.value);
        input.value = degs;
    });
}
function applyDirectionInput(answerContainer, type, units = '') {
    let f = getDirectionFormat(type, 0)
    if (isNaN(f.value)) return;
    let input = answerContainer.querySelector('input'),
        selectFirst = document.createElement('select'),
        selectLast = document.createElement('select'),
        idSuffix = randomId();
    input.style.setProperty('display', 'none', 'important');
    if (f.prefix) {
        selectFirst.id = 'first_sgn_' + idSuffix;
        selectFirst.className += 'select form-select d-inline-block';
        selectFirst.add(new Option('N', '1'));
        selectFirst.add(new Option('S', '-1'));
        input.parentNode.insertBefore(selectFirst, input);
    }
    if (type != 'rhumb' && type != 'nearistRhumb') {
        input.insertAdjacentHTML('beforebegin', input_html.replace('idSuffix', idSuffix));
    }
    let inp = content.querySelector('#signed_input_' + idSuffix);
    if (units) {
        if (units == '°' || units == '\'')
            input.insertAdjacentHTML('beforebegin', "<span style='line-height:10px;vertical-align:top;'>" + units + "</span>");
        else
            input.insertAdjacentHTML('beforebegin', "<span>" + units + "</span>");
    }
    let options = f.options;
    if (options.length > 0) {
        selectLast.id = 'first_sgn_' + idSuffix;
        selectLast.className += 'select form-select d-inline-block';
        if (options.length == 2) { // E/W
            selectLast.add(new Option('E', '1'));
            selectLast.add(new Option('W', '-1'));
        } else {
            for (i = 0; i < option.length; i++) {
                selectLast.add(new Option(options[i], i));
            }
        }
        input.parentNode.insertBefore(selectLast, input);
    }
    if (input.value) {
        f = getDirectionFormat(type, input.value);
        if (!isNaN(f.value)) {
            if(inp) inp.value = formatFloat(f.value);
            if (f.prefix) {
                for (let i = 0; i < selectFirst.options.length; i++) {
                    if (selectFirst.options[i].text === f.prefix) {
                        selectFirst.selectedIndex = i;
                        break;
                    }
                }
            }
            if (f.suffix) {
                let i = f.options.indexOf(f.suffix);
                if (i > -1) selectLast.selectedIndex = i; 
            }
        }
    }
    if (input.getAttribute('readonly') || input.disabled) {
        inp.disabled = true;
        selectFirst.disabled = true;
        selectLast.disabled = true;
    }
    formatCorrectAnswer(answerContainer, type, units);
    const form = content.closest('#responseform');
    form.addEventListener('submit', function () {
        let v = (inp) ? inp.value : '0';
        input.value = formatFloat(parseDirection(type,selectFirst.value,v,selectLast.value));
    });

}
function applyTimeInput(answerContainer) {
    let input = answerContainer.querySelector('input'),
        idSuffix = randomId();
    input.style.setProperty('display', 'none', 'important');
    input.insertAdjacentHTML('beforebegin', time_input_html.replace('idSuffix', idSuffix));
    let inp = content.querySelector('#time_input_' + idSuffix);
    if (input.value) inp.value = formatTime(input.value, ':');
    if (input.getAttribute('readonly') || input.disabled) inp.disabled = true;
    formatCorrectAnswer(answerContainer, 'time');
    const form = content.closest('#responseform');
    form.addEventListener('submit', function () {
        let v = parseFloat(inp.value.replace(",", ".").replace(":", "."));
        if (isNaN(v) || v < 0 || v > 24) return;
        let hours = Math.floor(v),
            mins = Math.round((v - hours) * 100);
        input.value = hours + mins / 60;
    });
}
function applySignedInput(answerContainer, units = '') {
    let input = answerContainer.querySelector('input'),
        idSuffix = randomId();
    input.style.setProperty('display', 'none', 'important');
    input.insertAdjacentHTML('beforebegin', input_html.replace('idSuffix', idSuffix));
    if (units) {
        if (units == '°' || units == '\'')
            input.insertAdjacentHTML('beforebegin', "<span style='line-height:10px;vertical-align:top;'>" + units + "</span>");
        else
            input.insertAdjacentHTML('beforebegin', "<span>" + units + "</span>");
    }
    let inp = content.querySelector('#signed_input_' + idSuffix);
    inp.value = input.value;
    if (input.getAttribute('readonly') || input.disabled)
        inp.disabled = true;
    else if (input.value) {
        let inp_str = input.value.replace(',', '.'),
            val = parseFloat(inp_str);
        if (!isNaN(val)) {
            if (val > 999999) inp.value = formatFloat(inp_str.replace('9999999', ''));
            else if (val > 0 && inp_str.indexOf('+' == -1)) inp.value = '+' + formatFloat(val);
        }
    }
    formatCorrectAnswer(answerContainer, 'signed', units);
    const form = content.closest('#responseform');
    form.addEventListener('submit', function (event) {
        switch (event.submitter.name) {
            case 'finish':
                if (missingPlus(inp.value)) input.value = '​' + inp.value;
                break;
            case 'save':
                if (missingPlus(inp.value)) input.value = '9999999' + inp.value;
                break;
            default:
                input.value = inp.value;
        }
    });
}
//function applyEWInput(answerContainer, units = '') {
//    let input = answerContainer.querySelector('input'),
//        select = document.createElement('select'),
//        idSuffix = randomId();
//    input.style.setProperty('display', 'none', 'important');
//    select.id = 'ew_sgn_' + idSuffix;
//    select.className += 'select form-select d-inline-block';
//    select.add(new Option('E', '1'));
//    select.add(new Option('W', '-1'));
//    input.insertAdjacentHTML('beforebegin', input_html.replace('idSuffix', idSuffix));
//    if (units) {
//        if (units == '°' || units == '\'')
//            input.insertAdjacentHTML('beforebegin', "<span style='line-height:10px;vertical-align:top;'>" + units + "</span>");
//        else
//            input.insertAdjacentHTML('beforebegin', "<span>" + units + "</span>");
//    }
//    input.parentNode.insertBefore(select, input);
//    let inp = content.querySelector('#signed_input_' + idSuffix);
//    if (input.value) {
//        let v = parseFloat(input.value.replace(',', '.'));
//        if (!isNaN(v)) {
//            let sgn = (v < 0) ? -1 : 1;
//            inp.value = Math.abs(v);
//            select.value = sgn;
//        }
//    }
//    if (input.getAttribute('readonly') || input.disabled) {
//        inp.disabled = true;
//        select.disabled = true;
//    }
//    formatCorrectAnswer(answerContainer, 'ew', units);
//    const form = content.closest('#responseform');
//    form.addEventListener('submit', function () {
//        let d = parseFloat(inp.value.replace(',', '.'));
//        if (!isNaN(d)) d *= parseInt(select.value);
//        input.value = d;
//    });
//}
function missingPlus(value) {
    let str_val = value.toString(),
        v = parseFloat(str_val.replace(",", "."));
    return !isNaN(v) && v > 0 && str_val.indexOf('+') != 0;
}

//************ Deviation table ********
function createDeviationTable(tag, className) {
    var table = '<table width="auto" class="deviation-table"><thead style="text-align: center;"><tr>';
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
    let owner = document.querySelector(tag + '.' + className)
    owner.innerHTML = table;
    for (const el of owner.querySelectorAll('th, td')) {
        el.style.cssText += 'padding: 3px 10px;border:1px solid black';
    }
}
function getDeviation(kk) {
    kk = kk * Math.PI / 180;
    var x = 0.2625 - 3.8607 * Math.sin(kk) + 1.012 * Math.cos(kk) + 0.075 * Math.sin(2 * kk) + 0.5 * Math.cos(2 * kk)
    return Math.round(x * 10) / 10;
}
