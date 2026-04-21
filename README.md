# moodle
**Additional functions for moodle platform (user side)**
1. popup/dialog windows:

   - Add script at the beginning of the page:
     
   ```javascript
   <script type="text/javascript>
        document.addEventListener('DOMContentLoaded', function () {
            applyToolTips();
            applyPopUp();
        });
   </script>
   ```

- put selected text inside <span></span> tag.

- add appropriate class (**tooltipOwner/popupOwner**) to span

Popup/dialog window settings are made via data-* attributes:

- Content:

   - data-text: simple text

   - data-html: html formatted text

   - data-url: url with content

   - data-childid: id of element, located on same page
     
- Behavior:

   - data-caption: Caption text
     
   - data-footer: Footer text
 
   - data-closebutton: close button text (for dialog window, default '×')
 
   - data-width: window width (i.e. '500px')
 
   - data-align: text align
 
**Markup examples:**
```html
- simple text - tooltip
<p>This is <span class='tooltipOwner' data-text='Tooltip content' data-caption="Caption" data-footer="Footer">ToolTip</span> owner</p>
- html (image) tooltip
<p>This is <span class='tooltipOwner' data-html='<img src="https://www.msun.ru/assets/img/fac/fac-sudovod-col.svg"/>' data-caption="Caption" data-footer="Footer">Image ToolTip</span> owner</p>
- html (image) popup
<p>This is <span class='popupOwner' data-html='<img src="https://www.msun.ru/upload/images/prospect/207.jpg"/>'data-caption="Caption" data-footer="Footer" data-align='center'>Image PopUp</span> owner</p>
- child tooltip
<div id='tooltipChild_1' style='display:none;'>
   <!--InnerHTML here (div content)--!>
</div>
<p>This is <span class='tooltipOwner' data-childid='tooltipChild_1'>ToolTip</span> owner</p>
- url popup
<p>This is <span class='popupOwner' data-url='https://www.google.com/' data-width='800px' data-caption='Google' data-width='800px'>URL PopUp</span> owner</p>
   ```
2. Non standard questions input:

      - Add script at the beginning of the page:
        
```javascript
<script type="text/javascript>
   var content = document.currentScript.closest('div.content');
   document.addEventListener('DOMContentLoaded', function () {
       if (!content) return;
       if (numericQuestion('position')) return;
       clozeQuestion('position');
   });   
</script>  
```
**Markup examples:**
