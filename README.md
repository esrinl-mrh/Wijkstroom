# Wijkstroom-router - ArcGIS Maps SDK for JavaScript 5.1

## Werking
De router gebruikt OAuthInfo + IdentityManager voor OAuth authorization-code/PKCE, Portal voor de aangemelde gebruiker en esriRequest naar `/sharing/rest/community/self` voor `groups[]`. Alleen vooraf geconfigureerde Group IDs kunnen routeren.

## Configuratie
1. Maak in ArcGIS Online OAuth 2.0 credentials voor user authentication.
2. Registreer exact de productie-URL van deze map, bijvoorbeeld `https://gis.wijkstroom.nl/router/`.
3. Vul in `config.js` de App ID, Wijkstroom Org ID, Group IDs en Experience URLs in.
4. Deel iedere Experience en alle onderliggende items uitsluitend met de juiste WS-groep.
5. Host de map als statische HTTPS-site. Open niet via `file://`.

## Test lokaal
Gebruik een lokale webserver, bijvoorbeeld `python -m http.server 8000`, en registreer de exacte lokale redirect-URL in de OAuth-credential voor alleen de testomgeving.

## Beveiliging
- Geen client secret in deze browserapp.
- OAuth authorization-codeflow via SDK 5.1.
- Controle op `orgId`.
- Exact één bekende WS-groep vereist.
- Redirectbestemmingen zijn allowlisted.
- De router is UX, geen security boundary; ArcGIS sharing blijft leidend.
- Zet op de webserver bij voorkeur `Cache-Control: no-store`, een strikte CSP en `X-Content-Type-Options: nosniff`.
