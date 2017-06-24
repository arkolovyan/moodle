function getPath(url){
  if(!url) return '';
  if(url.indexOf('http')==0)return url;
  return 'http://moodle.msun.ru/draftfile.php/8366/user/draft/'+url;
}

function appendStyleSheet(url){
   $('<link/>', {rel: 'stylesheet', href: url}).appendTo('head');
}
function setStyle(selector,style){
   $(selector).attr('style',style);
}
function appendStyle(selector,style,value){
   $(selector).css(style,value);
}
function appendStyles(selector,styles){
   $(selector).css(styles);
}

//************ Tool Tips********
function applyToolTips(){
   $('.tooltipImage,.tooltipText,.tooltipChild,.tooltipEquation,.tooltipUrl')
    .each(function(){appendTipDiv($(this))});
}

function appendTipDiv(elem){
   if(elem.children('.toolTipDiv').first().length>0) return;
   var div=$('<div class="toolTipDiv" />')
           .css(
              {
               'position': 'fixed',
               'z-index': 999,
               'display': 'none',
               'color': 'blue',
               'background-color': 'lavender',
               'border': '1px solid silver',
               'border-radius': '5px',
               'padding': '5px'
              })
           .appendTo(elem);

   if(elem.attr('tooltipWidth')) div.width(elem.attr('tooltipWidth'));

   if(elem.attr('tooltipHeader'))
      $('<p align="center" />')
      .css({'background-color':'blue','color':'white'})
      .html(elem.attr('tooltipHeader')).appendTo(div);


   if (elem.hasClass('tooltipImage'))
      $('<img alt="" />')
        .attr('src',getPath(elem.attr('imgsrc')))
        .appendTo(div);
   else if (elem.hasClass('tooltipText'))
      div.html(elem.attr('poptext'));            
   else if (elem.hasClass('tooltipEquation'))
      div.html('\\(\\displaystyle '+elem.attr('poptext')+'\\)');
   else if (elem.hasClass('tooltipUrl'))
      div.load(getPath(elem.attr('srcUrl')));
   else if (elem.attr('childclass'))
      $('.'+elem.attr('childclass')).css('display','inline-block').appendTo(div);

   if(elem.attr('tooltipFooter'))
      $('<p align="center" />')
      .css({'background-color':'palegreen','color':'black'})
      .html(elem.attr('tooltipFooter')).appendTo(div);

   elem.css({'color':'magenta','cursor':'pointer'})
       .mouseenter(function(){showToolTip(elem);})
       .mouseleave(function(){hideToolTip(elem);});
}

function showToolTip(elem){
   var tip=elem.children('.toolTipDiv').first();
   if(tip.length==0) return;
   tip.css('display','inline');
   var pos = elem.offset();
   var w=(elem.outerWidth()-tip.outerWidth())/2,
       h=tip.outerHeight();
   var popLeft=pos.left+w, popTop=pos.top-h-5;
   if (popLeft<$(window).scrollLeft()) popLeft=$(window).scrollLeft(); 
   if (popTop<$(window).scrollTop()) popTop=pos.top+elem.outerHeight()+5;
   tip.offset({left:popLeft,top:popTop}).show();
}

function hideToolTip(elem){
   elem.children('.toolTipDiv').first().hide();
}
//************ Tool Tips End ********

//************ Pop Up dialog ********
function applyPopUp(){
   var elems=$('.popupImage,.popupText,.popupChild,.popupUrl');
   if (elems.length>0 && elems.filter('[popupApplied]').length==0){
      elems.first().attr('popupApplied','true');
      require(['jquery', 'core/modal_factory'], function($, ModalFactory) {
         ModalFactory.create({
             title: 'title',
             body: '<p>Dialog body</p>',
             footer:'',
             large:false
          })
          .done(function(modal) {
              elems.css({'color':'limegreen','cursor':'pointer'})
              .attr('title','Показать')  
              .mouseenter(function(){$(this).css({'text-decoration':'underline','color':'lime'})})
              .mouseleave(function(){$(this).css({'text-decoration':'','color':'limegreen'})})
              .click(function(){showModal($(this),modal)});
         });
      });
   }
}

function showModal(elem,modal){
   if(elem.attr('large')=='1') modal.setLarge();
   modal.title.text(elem.attr('dialogTitle') || elem.text());
   modal.footer.html(elem.attr('dialogFooter') || '');
   var div=$('<div />');
   if (elem.hasClass('popupImage'))
      $('<img alt="" />')
        .attr('src',getPath(elem.attr('imgsrc')))
        .css({'display':'block','margin':'0 auto'})    
        .appendTo(div);
   else if (elem.hasClass('popupText'))
      div.html(elem.attr('poptext'));
   else if (elem.hasClass('popupUrl'))
      div.load(getPath(elem.attr('srcurl')),function(){
         modal.body.html(div.html());
         modal.show();
         return;
      });
   else if (elem.attr('childclass'))
      $('.'+elem.attr('childclass')).css('display','inline-block').appendTo(div);

   modal.body.html(div.html());
   modal.show();
}

//************ Pop Up dialog End ********

//************ Test questions UI ********
function replaceHidden(content,id,values){
   var value=content.find('#'+id+'_hidden').val();
   content.find('#'+id).text(values[value]);
}

function replaceNegativeText(content,positive,negative){
   var div= content.find('div.rightanswer');
   if (div.length>0) {
      var text=div.html();
      if (text.indexOf('-')>-1) div.html(text.replace('-','').replace(positive,negative)); 
   }
}

function replaceNegativeInput(content,negative){
   var input=content.find('span.answer input');
   if(!input.attr('readonly')){
      var v=input.val();
      if (v.indexOf('-')==0) {
         input.val(v.substring(1));
         content.find('span.answer select').val(negative);
      }
   }
}

function showSign(content,id){
   var value=parseFloat(content.find('#'+id+'_hidden').val());
   if (value>0) content.find('#'+id).text('+');
}

function showCorrectAnswerSign(content){
   var div= content.find('div.rightanswer');
   if (div.length>0) {
      var text=div.html();
      if (text.indexOf('-')==-1) div.html(text.replace(': ',': +')); 
   }
}

function showInputSign(content){
   var input=content.find('span.answer input');
   if(!input.attr('readonly')){
      var v=input.val();
      if (v && v.indexOf('-')!=0) input.val('+'+v);
   }
}

function formatTime(value,separator){
    if(!separator) separator='.';
    var v=parseFloat(value.toString().replace(",","."));
    if(isNaN(v) || v<0 || v>24) return value;
    var hours=Math.floor(v),
        mins=Math.round((v-hours)*60);
    if(hours<10) hours='0'+hours;
    if(mins<10) mins='0'+mins;
    return hours+separator+mins; 
}

function parseTime(value){
    v=parseFloat(value.toString().replace(",",".").replace(":","."));
    if(isNaN(v) || v<0 || v>24) return value;
    var hours=Math.floor(v),
        mins=Math.round((v-hours)*100);
    return hours+mins/60;
}

function applyTimeInput(content){
    var input=content.find('span.answer input'),
        rightAnswer=content.find('div.rightanswer');

    if(input.val()) input.val(formatTime(input.val()));

    content.closest('#responseform').submit(function(){
        var inp=input.clone();
        inp.val(input.val()).attr('id','temp').attr('name','temp');
        input.hide();
        inp.appendTo(input.parent());
        input.val(parseTime(input.val()));  
    });

    if (rightAnswer.length>0){
       var s=rightAnswer.text(), pos=s.indexOf(':')+2;
       rightAnswer.html(s.substring(0,pos)+formatTime(s.substring(pos)));  
    } 
}

function formatPosition(value,positive,negative){
    var v=parseFloat(value.replace(",","."));
    var sgn=(v<0)?negative:positive; 
    v=Math.abs(v);
    var deg=Math.floor(v)
    var mins=Math.round((v-deg)*600)/10;
    if(mins<10) mins='0'+mins;
    if((mins+'').length<3) mins=mins+'.0';
    return deg+'&deg;'+mins+"'"+sgn;
}

function formatLatitude(value){
    return formatPosition(value,'N','S');
}

function formatLongitude(value){
    return formatPosition(value,'E','W');
}

function applyPositionInput(content,positive,negative){
    var input=content.find('span.answer input'),
        select=content.find('span.answer select'),
        rightAnswer=content.find('div.rightanswer');
    var input_deg=$('<input type="text" maxlength="3" style="width:80px;text-align:right;">'),
        span_deg= $('<span style="line-height:4px;vertical-align:top;">&deg;</span>'),
        input_mins=$('<input type="text" maxlength="4" style="width:80px;text-align:right;">'),
        span_mins=$('<span style="line-height:4px;vertical-align:top;">\'</span>');
    input.before(input_deg,span_deg,input_mins,span_mins); 
    input.hide();
    if(input.val()){
       var v=parseFloat(input.val().replace(",","."));
       if(!isNaN(v)){ 
          var sgn=(v<0)?negative:positive;
          v=Math.abs(v);
          input_deg.val(Math.floor(v));
          var mins=Math.round((v-input_deg.val())*600)/10;
          if(mins<10) mins='0'+mins;  
          input_mins.val(mins);
          if(select.prop('disabled')){
             input_deg.prop('disabled',true);
             input_mins.prop('disabled',true);
          }else{
             select.val(sgn);
          }
       }
    }
    content.closest('#responseform').submit(function(){
        var d=parseInt(input_deg.val());
        if(isNaN(d)) d=input_deg.val();
        var m=parseFloat(input_mins.val().replace(',','.'))/60;
        if(isNaN(m)) m=input_mins.val();
        input.val(d+m);
    });
    if (rightAnswer.length>0){
       var s=rightAnswer.text(), pos=s.indexOf(':')+2;
       rightAnswer.html(s.substring(0,pos)+formatPosition(s.substring(pos),positive,negative));  
    } 
}

function applyLatitudeInput(content){
    applyPositionInput(content,'N','S');
}

function applyLongitudeInput(content){
    applyPositionInput(content,'E','W');
}

function nearestRhumb(val,rhumbs){
    return rhumbs[Math.round(((360+val) % 360)*rhumbs.length/360)];
}