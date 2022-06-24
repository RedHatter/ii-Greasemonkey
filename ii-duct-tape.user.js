// ==UserScript==
// @name        ii-duct-tape
// @namespace   http://idioticdev.com
// @description Makes the hotkeys more consistent, so that e.g. Bank of Improbable is always "b".
// @include     http://*improbableisland.com/*
// @include     https://*improbableisland.com/*
// @exclude     http://*improbableisland.com/home.php*
// @exclude     https://*improbableisland.com/home.php*
// @version     2.2
// @require     https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js
// @run-at      document-start
// ==/UserScript==
const keys = {
  // universal_links
  'Return to the Outpost': 'o',
  'View your Inventory': 'i',
  'Return to the Jungle': 'j',

  // outpost_links
  "eBoy's Trading Station": 'e',
  "Sheila's Shack O' Shiny": 's',
  'Bank of Improbable': 'b',
  'Quit to the fields': 'Q',
  'New Day Menu': '*',
  "The Hunter's Lodge": 'l',
  'Location Four': '4',
  'Frequently Asked Questions': '?',
  'Council Offices': 'c',
  "Hall o' Fame": 'f',
  'Common Ground': 'g',
  'Clan Halls': 'h',
  Jungle: 'j',
  'Daily News': 'n',
  Preferences: 'p',
  Travel: 't',
  'List Contestants': 'w',
  ScrapYard: '#',
  "Joe's Dojo": 'd',
  'Rally Headquarters': 'r',
  'Reinforce the Defences': 'r',

  // travel_links
  North: 't',
  East: 'h',
  South: 'b',
  West: 'f',
  'North-East': 'y',
  'North-West': 'r',
  'South-East': 'n',
  'South-West': 'v',
  'Enter the Jungle': 'j',
  'World Map': 'm',
  'Pick up Supply Crate': 'p',

  // OST
  'Go to AceHigh': 'a',
  'Go to Cyber City 404': 'c',
  'Go to Improbable Central': 'i',
  'Go to NewHome': 'h',

  // Looking for trouble
  'Hospital Tent': 'h',
  'Look for an Easy Fight': '1',
  'Look for Trouble': '2',
  'Look for Big Trouble': '3',
  'Look for Serious Trouble': '4',
}

const alpha = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
]

let links = {}

document.addEventListener('keypress', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey || document.querySelector('input:focus') !== null) return

  let key = String.fromCharCode(e.charCode)
  let link = document.querySelector(`[accesskey='${key}']`)
  if (link === null) return

  link.click()
})

waitForKeyElements('a.nav', assign, true, 100)

function assign(node) {
  const oldKey = node.getAttribute('accesskey')

  const title = node.innerText.replace(/^\(.*?\) ?/g, '')
  const cleanTitle = title.replace(/ ?\(.*?\) ?/g, '')
  let key = keys[cleanTitle]

  if (!key) {
    key = Array.from(cleanTitle.toLowerCase()).find((k) => links[k] === undefined && alpha.includes(k))
  }

  if (!key) {
    key = alpha.find((k) => links[k] === undefined)
  }

  if (!key) {
    node.removeAttribute('accesskey')
    node.innerHTML = title
    return
  }

  const reassign = links[key]
  links[key] = node
  if (reassign) {
    assign(reassign)
  }

  let index = title.toLowerCase().indexOf(key)
  if (index === -1) index = title.indexOf(key)

  node.innerHTML =
    index > -1
      ? `${title.substring(0, index)}<span class="navhi">${title.charAt(index)}</span>${title.substring(index + 1)}`
      : `(<span class="navhi">${key}</span>) ${title}`
  node.setAttribute('accesskey', key)
}
