// ==UserScript==
// @name        ii-monster-research-claimer
// @description Claims all rewards when in the Monster Research Lab in Pleasantville
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @include     http*://www.improbableisland.com/runmodule.php?module=monsterresearchlab*
// @version     1.0
// ==/UserScript==

const all = $('table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > a').map((i, a) => a).toArray().filter(a => ['Claim', 'Claim all'].includes(a.text))
const claimAll = all.filter(a => a.text === 'Claim all')
const claim = all.filter(a => a.text === 'Claim')

if (claimAll.length > 0) { window.location = claimAll[0].href }
if (claim.length > 0) { window.location = claim[0].href }
