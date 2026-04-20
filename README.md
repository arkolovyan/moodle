# moodle
**Additional functions for moodle platform (user side)**
1. popup/dialog windows:
   Add script at the beginning of the page:
   ```
   <script type="text/javascript>
        document.addEventListener('DOMContentLoaded', function () {
            applyToolTips();
            applyPopUp();
        });
   </script>
   ```
