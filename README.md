# moodle
**Additional functions for moodle platform (user side)**
1. popup/dialog windows:
   -Add script at the beginning of the page:
   ```
   <script type="text/javascript>
        document.addEventListener('DOMContentLoaded', function () {
            applyToolTips();
            applyPopUp();
        });
   </script>
   ```
-put selected text inside <span></span> tag.
-add appropriate class (**tooltipOwner/popupOwner**) to span
Popup/dialog window behavior is setting via data-* attributes:
