// ==UserScript==
// @name        ii-junk
// @description Lists item price, price per kg, and total bag value in inventory.
// @namespace   http://idioticdev.com
// @include     http://*improbableisland.com/inventory.php*
// @include     https://*improbableisland.com/inventory.php*
// @include     http://*improbableisland.com/badnav.php
// @include     https://*improbableisland.com/badnav.php
// @include     http://*improbableisland.com/runmodule.php?module=eboy*
// @include     https://*improbableisland.com/runmodule.php?module=eboy*
// @version     1
// ==/UserScript==
const priceValues = JSON.parse(localStorage.getItem('priceValues')) ?? {}

if (window.location.href.includes('inventory')) {
  const backpackHeading = document.evaluate("//b[contains(., 'Backpack')]", document).iterateNext()
  const backpackTable = document.evaluate("ancestor::table", backpackHeading).iterateNext()
  const backpackValue = caluclatePricesForElement(backpackTable)
  backpackHeading.insertAdjacentHTML('afterend', ` &mdash; ${backpackValue} req`)

  const bandolierHeading = document.evaluate("//b[contains(., 'Bandolier')]", document).iterateNext()
  const bandolierTable = document.evaluate("ancestor::table", bandolierHeading).iterateNext()
  const bandolierValue = caluclatePricesForElement(bandolierTable)
  bandolierHeading.insertAdjacentHTML('afterend', ` &mdash; ${bandolierValue} req`)
} else {
  const itemIterator = document.evaluate("//span[contains(., 'Buying at')]", document)
  let itemPriceElement

  while (itemPriceElement = itemIterator.iterateNext()) {
    const itemName = document.evaluate("ancestor::table[2]//b", itemPriceElement).iterateNext().textContent
    const priceText = itemPriceElement.textContent
    const price = parseInt(priceText.substring(priceText.indexOf(': ') + 2))
    priceValues[itemName] = price
  }

  localStorage.setItem('priceValues', JSON.stringify(priceValues))
}

function caluclatePricesForElement (element) {
  return Object.entries(priceValues).reduce((total, [itemName, itemValue]) => {
    const itemNameElement = document.evaluate(`.//b[text()='${itemName}']`, element).iterateNext()
    if (itemNameElement === null) return total
        
    const text = itemNameElement.parentNode.textContent
    const { groups: { quantity, weight } } = text.match(/(?:Quantity: (?<quantity>[\d,]+) \| )?Weight: (?<weight>[\d,.]+) kg/)

    const rqk = Math.round((itemValue / parseFloat(weight)) * 100) / 100
    
    if (quantity !== undefined) {
      itemValue *= parseInt(quantity)
    }

    itemNameElement.nextElementSibling.insertAdjacentHTML('afterend', `Value: <b>${itemValue}</b> req, ${rqk} per kg | `)
      
    return total + itemValue
  }, 0)
}
