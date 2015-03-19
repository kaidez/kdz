<?php
  
  // Remove extra <p> tags and (I think) <br /> tags from page content
  remove_filter('the_content', 'wpautop');

?>