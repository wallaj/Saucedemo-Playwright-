import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Recording...
  await page.goto('https://login.microsoftonline.com/f3211d0e-125b-42c3-86db-322b19a65a22/oauth2/v2.0/authorize?client_id=e43f29f5-a420-4e62-ab10-4616afcc2440&scope=openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Fcionownext.ciotest.accenture.com%2F&client-request-id=06c9dd02-6f13-436a-8dfd-f69ebc04a92f&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.3.0&client_info=1&code_challenge=72dplCZRHetOiM55siznGWVDjp-2POI8hxI7bhdZUwI&code_challenge_method=S256&nonce=7df6c5ae-ca77-4574-b391-9a2b1aebf7c7&state=eyJpZCI6ImI0NGU5YTEwLTAwZjItNDFhYS1hOTg2LTg2Zjg3N2U3OGI1ZSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D');

  await page.getByRole('textbox', { name: 'Enter your email, phone, or' }).click();
  await page.getByRole('textbox', { name: 'Enter your email, phone, or' }).fill('T308941TestAutom@ds.dev.accenture.com');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('textbox', { name: 'Enter the password for' }).click();
  await page.getByRole('textbox', { name: 'Enter the password for' }).fill('_pC;=lW.b9;J9UJ0iWZL');
  await page.getByRole('textbox', { name: 'Enter the password for' }).click();
  await page.getByRole('textbox', { name: 'Enter the password for' }).click();
  await page.getByRole('textbox', { name: 'Enter the password for' }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.goto('https://cionownext.ciotest.accenture.com/#code=1.ASYADh0h81sSw0KG2zIrGaZaIvUpP-QgpGJOqxBGFq_MJEAAAAAmAA.BQABBAIAAAADAOz_BQD0_0V2b1N0c0FydGlmYWN0cwIAAAAAAMnO8cTbC8Wf56BvC2i_cG26FblV3V-5CMlKW1vf6vHVY2Kp7uRxP22Boeu1h-E_3sC5C7BMGm8EUPsLDrRRTTCp9OR9MJP0ZG6qSzX-MDJO2TyXBFiqRAJtXTBDzvi0TtE3NanxIEGCZNP2EzFE82zoZEhBaLjrkLjg7GMjWZbOuSMT_MdJovgN6R7omUM0d2PE-93igsQdMu1vpzqRHPB01pogO5-ZqSYiLYklsD0ovB-IrcbS7LGUZlGyIGsPDhRrjjcQBIX00ZtFhRBgrxOj5m0Fae_Gn3PjNSqhb9VA4bMuG-NRFi91L9aBfeKxLzSrjEr0w4LPcKxWeUe8UrrYkIfEY9EC91vdaV8m8EIY-u2jqzk1tUYrn3jrvHlAK8nftvIH8QljEhaumU4chDOXHW6WvuiBE9gN9M0bzimPGtixPkXGrYEyXUvE2bwXyW9ZFGjT7pRObXlofPlM8Twryv_DNJBFr0WzwDedmhNLEkvxlxVok2wLWGv5SHSPhVlCC1NTtjx3pgL6G--jJo9SmG9y7kl5Db8cKoqzIFA8STl4H5UG0IQjIjbXLzSlOqp2LIxkYsE_IIXkTatSPoWvevFUhO-vBRuEvhV03E-psdeE0cauasZYhiK-qw-_4gJvoIjBogNXwyUgRruiTvDwujKnJquglyPpDtS08cq-21kKbEJJsflcLs1TCpLa-5LMwhkDQWBv2xFdbR5GyBJL7FBau2i02TDDkbpZA2gPlObu7Xglhxxh8LMQZ53CMS1mBxvZHMFVybBWTGfIbZM5WvqE9KiZ4zxBl5sIXYKz5G3BY2v51kidC3S4c4PNuV8BYvEIznQjcU8Eugt-8QgBLg0ExRyhVWyIO1X2SaTKOKXtpDNbtETettfbCj-QBV28O8uy4Xuf6Ysvb4q-o1yQCAmCUD3ruLMrRdBAcdVZ25PjzxyV--devOOBVrYTvk_1pxAX30PqbJqp7pkoYTB2EYiJtyJbMopqGIN5DDh61uHJwt3OFXiwfCstOCaRyQIQ31XbSDaoljxoJ2bpBzroz2OWIyu-t8FrfTTZrklVOyuMBJ7taUpjvappgr8RKITTanhJ7bqyrr12IFXdddrgznxYmqn9ZonQ7XpND854NVc7qWnqdNdhVdyYbnBoPUkjSp1DEYryNyCFObzKQQ9wH9pr2j7Th6TcM-pk1pZcq-cD6qaf4zYFzc-01oKxItDpwR2EsrX4qFCREr93QptyoP_N_hN_ngfRS46IUDPHcHMAmxy8N5fDjGPttXXhVZrt-IPNF59uvb44wrigxwLSuaQD_DortnPjM-zCFxHyAEoFCanavjOwc2pfHzKeIy2TLOzZ3p7EaHzw7r34mw0pGLQ7wJOEz809Vv9T1XQK&client_info=eyJ1aWQiOiI5YWM2YjNmNi1jNGU3LTRlN2ItOGJjZC01NGQ5ZDZlOTIyYjUiLCJ1dGlkIjoiZjMyMTFkMGUtMTI1Yi00MmMzLTg2ZGItMzIyYjE5YTY1YTIyIn0&state=eyJpZCI6IjAxOWM5OTY1LTA5NGYtN2MyMi04NmJlLTJjZDZiYzNjN2JhMyIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3d&session_state=0022840a-226b-1c64-c194-1e27578ac556');
  await page.goto('https://cionownext.ciotest.accenture.com/error');
});