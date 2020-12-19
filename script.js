const cart = document.getElementById('cart')
const cartDetails = document.getElementById('cartDetails')
const overlay = document.getElementById('overlay')
const closeIcon = document.getElementById('closeIcon')
const clearCart = document.getElementById('clearCart')
const content = document.getElementById('content')
const quantity = document.getElementById('quantity')
const selectionProduct = document.querySelectorAll('[data-selection-product]')
const totalPrice = document.getElementById('totalPrice')


var cartList = JSON.parse(localStorage.getItem('array')) || []
var cartQuantity = parseInt(localStorage.getItem('quantity') || 0)
quantity.innerHTML = cartQuantity
var totalProductPrice = parseInt(localStorage.getItem('totalPrice') || 0)
totalPrice.innerHTML = totalProductPrice


updateContent()
updateValue()
clearSameProduct()
inputCheckAndUpdate()


function  updateContent() {
  while(content.firstChild) {
    content.firstChild.remove()
  }
  for(var i = 0; i < cartList.length; i++) {
    var divElement = document.createElement('div')
    divElement.appendChild(document.createElement("span"))
    divElement.childNodes[0].innerHTML = cartList[i].id + ":"
    divElement.id = cartList[i].id

    divElement.appendChild(document.createElement("input"))
    divElement.childNodes[1].setAttribute("type", "number")
    divElement.childNodes[1].setAttribute("min", "1")
    divElement.childNodes[1].setAttribute("max", "10")
    divElement.childNodes[1].classList.add("input-check")
    divElement.childNodes[1].value = cartList[i].sameProductAmount


    divElement.appendChild(document.createElement("span"))
    divElement.childNodes[2].innerHTML = "$" + cartList[i].sameProductPrice
    divElement.childNodes[2].classList.add('total-single-price')

    divElement.appendChild(document.createElement("button"))
    divElement.childNodes[3].innerHTML = "&times;"
    divElement.childNodes[3].classList.add('clear-single-product')

    content.appendChild(divElement)
  }
}


function updateValue() {
  var quan = 0
  var totalAmount = 0

  for(var i = 0; i < cartList.length; i++) {
    quan += parseInt(cartList[i].sameProductAmount)
    totalAmount += parseInt(cartList[i].sameProductPrice)
  }

  document.getElementById('quantity').innerHTML = quan
  document.getElementById('totalPrice').innerHTML = totalAmount
  cartQuantity = quan
  totalProductPrice = totalAmount
  localStorage.quantity = quan
  localStorage.totalPrice = totalAmount
}


function clearSameProduct() {
  var clearSingleProduct = document.querySelectorAll(".clear-single-product")
  clearSingleProduct.forEach(clearProduct => {
    clearProduct.addEventListener('click', () => {
      var clearDataId = clearProduct.parentElement.id
      for(var i = 0; i < cartList.length; i++) {
        if(cartList[i].id == clearDataId) {
          cartList.splice(i, 1)
          break
        }
      }
      localStorage.array = JSON.stringify(cartList)

      updateContent()
      updateValue()
      inputCheckAndUpdate()
    })
  })
}


function inputValidation(val) {
  val.onkeydown = function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
  }
}


function inputCheckAndUpdate() {
  var setInput = document.querySelectorAll(".input-check")
  setInput.forEach(val => {
    inputValidation(val)

    val.addEventListener('input', e => {
      var inputValue = parseInt(e.target.value)
      document.addEventListener('click', function(event) {
        var isClickInsideElement = val.contains(event.target);
        if (!isClickInsideElement) {
          if(val.value == ""){
            val.value = 0
            for(var i = 0; i < cartList.length; i++) {
              if(cartList[i].id = val.parentElement.id) {
                cartList[i].sameProductAmount = parseInt(val.value)
                cartList[i].sameProductPrice = 0
                val.parentElement.childNodes[2].innerHTML = "$" + cartList[i].sameProductPrice
                localStorage.array = JSON.stringify(cartList)

                break
              }
            }

            updateValue()
            clearSameProduct()
          }
        }
      })
      
      if(inputValue >= 0) {
        var singlePrice
        selectionProduct.forEach(product => {
          if(product.dataset.selectionProduct == val.parentElement.id) {
            singlePrice = parseInt(product.dataset.singlePrice) * inputValue
          }
        })
        
        
        for(var i = 0; i < cartList.length; i++) {
          if(cartList[i].id == val.parentElement.id) {
            cartList[i].sameProductAmount = parseInt(inputValue)
            cartList[i].sameProductPrice = parseInt(singlePrice)
            val.parentElement.childNodes[2].innerHTML = "$" + cartList[i].sameProductPrice
            localStorage.array = JSON.stringify(cartList)
            break
          }
        }
        
        updateValue()
        clearSameProduct()
      }
    })
  })
}


cart.addEventListener('click',() => {
  cartDetails.style.display="block"
  overlay.style.display="block"

  updateContent()
  updateValue()
  clearSameProduct()
  inputCheckAndUpdate()
})


closeIcon.addEventListener('click', () => {
  cartDetails.style.display="none"
  overlay.style.display="none"

  updateContent()
  updateValue()
  clearSameProduct()
  inputCheckAndUpdate()
})


overlay.addEventListener('click', () => {
  cartDetails.style.display="none"
  overlay.style.display="none"

  updateContent()
  updateValue()
  clearSameProduct()
  inputCheckAndUpdate()
})


clearCart.addEventListener('click', () => {
  quantity.innerHTML = 0
  document.getElementById('totalPrice').innerHTML = 0
  while(content.firstChild) {
    content.firstChild.remove()
  }

  cartList = []
  localStorage.array = JSON.stringify(cartList)
  cartQuantity = 0
  localStorage.quantity = 0
  totalProductPrice = 0
  localStorage.totalPrice = 0

  updateContent()
  updateValue()
  clearSameProduct()
  inputCheckAndUpdate()
})


function insertProductFirstTime(product) {
  cartQuantity += 1
  localStorage.quantity = cartQuantity
  quantity.innerHTML = parseInt(localStorage.quantity)

  totalProductPrice += parseInt(product.dataset.singlePrice)
  localStorage.totalPrice = totalProductPrice
  totalPrice.innerHTML = parseInt(localStorage.totalPrice)

  var check = false
  for(var i = 0; i < cartList.length; i++) {
    if(cartList[i].id == product.dataset.selectionProduct) {
      cartList[i].sameProductAmount = parseInt(cartList[i].sameProductAmount) + 1
      cartList[i].sameProductPrice = parseInt(cartList[i].sameProductPrice) + parseInt(product.dataset.singlePrice)
      localStorage.array = JSON.stringify(cartList)
      check = true
    }
  }

  const item = {
    id: product.dataset.selectionProduct,
    sameProductAmount: 1,
    sameProductPrice: product.dataset.singlePrice
  }
  if(check == false) {
    cartList.push(item)
    localStorage.setItem("array", JSON.stringify(cartList))
  }
  
  updateContent()
  updateValue()
  clearSameProduct()
  inputCheckAndUpdate()
}


function insertSameProduct(i, product) {
  cartQuantity += 1
  localStorage.quantity = cartQuantity
  quantity.innerHTML = parseInt(localStorage.quantity)
  totalProductPrice += parseInt(product.dataset.singlePrice)
  localStorage.totalPrice = totalProductPrice
  totalPrice.innerHTML = parseInt(localStorage.totalPrice)

  var inputValue = parseInt(cartList[i].sameProductAmount) + 1
  var sameProductPrice = parseInt(product.dataset.singlePrice) * inputValue

  cartList[i].sameProductAmount = inputValue
  cartList[i].sameProductPrice = sameProductPrice
  localStorage.array = JSON.stringify(cartList)
  
  updateContent()
  updateValue()
  clearSameProduct()
  inputCheckAndUpdate()
}


selectionProduct.forEach(product => {
  product.addEventListener('click', () => {
    for(var i = 0; i < cartList.length; i++) {
      if(cartList[i].id == product.dataset.selectionProduct) {
        insertSameProduct(i, product)
        updateContent()
        updateValue()
        clearSameProduct()
        inputCheckAndUpdate()

        return
      }
    }

    insertProductFirstTime(product)
    updateContent()
    updateValue()
    clearSameProduct()
    inputCheckAndUpdate()
  })
})



