// Source - https://stackoverflow.com/a
// Posted by orvi, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-08, License - CC BY-SA 4.0
// I would cite this but it seems that it was done automatically! This is so that I can make my requests more secure and don't have to use the csrf exempt tag on all of my django functions
import React from 'react';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie('csrftoken');

const CSRFToken = () => {
  return (
    <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
  );
};
export default CSRFToken;
export { getCookie };
