import fetch, { Request } from 'cross-fetch';
// Or just: import 'cross-fetch/polyfill';
let request = new Request('')


(async () => {
  try {
    const res = await fetch('https://reddit.com/api');

    if (res.status >= 400) {
      throw new Error("Bad response from server");
    }

    const user = await res.json();

    console.log(user);
  } catch (err) {
    console.error(err);
  }
})();