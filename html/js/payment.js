const packages = {
  rafting: '25 kms',
  hiking: '4 days/3 nights',
  camping: '3 days/2 nights',
}

const price = {
  rafting: 5000,
  hiking: 10000,
  camping: 8000,
}

const imgs = {
  rafting: 'file:///D:/TrailBlazer/TrailBlazer/html/images/img-1.png',
  hiking: 'file:///D:/TrailBlazer/TrailBlazer/html/images/img-2.png',
  camping: 'file:///D:/TrailBlazer/TrailBlazer/html/images/img-3.png',
}

const codes = {
  'TEST123': 500,
}

let mainType;

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function commaFormat(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function showModalFor(type) {
  const modalBody = document.querySelector('.modal-body');
  console.log(modalBody);
  mainType = type;

  const item = modalBody.querySelector('#itemSelected');
  item.innerHTML = `
<div class="left-holder">
  <img src="${imgs[type]}" class="payment-img">
  <div class="package-name">
    <div class="holder">
      <label class="payment-label">${capitalize(type)}</label>
      <label class="package-desc">Package - ${packages[type]}</label>
    </div>
    <div class="price-holder">
      <label class="price">Rs. ${commaFormat(price[type])}.00/-</label>
    </div>
  </div>
</div>`;

  const basePrice = modalBody.querySelector('#basePrice');
  basePrice.innerHTML = `Rs. ${commaFormat(price[type])}.00/-`;

  const totalValue = modalBody.querySelector('#totalValue');
  totalValue.innerHTML = `Rs. ${commaFormat(price[type])}.00/-`;
}

function applyCode() {
  const code = document.querySelector('#couponCode').value;
  const discount = codes[code];
  const errorMsg = document.querySelector('#errorMsg');
  errorMsg.innerHTML = '';
  if (!discount) {
    errorMsg.innerHTML = 'Invalid coupon!';
  }
  const basePrice = price[mainType];
  const discountedPrice = basePrice - discount;
  const discountValue = document.querySelector('#promotion');
  discountValue.innerHTML = `Rs. ${commaFormat(discount)}.00/-`;

  const totalValue = document.querySelector('#totalValue');
  totalValue.innerHTML = `Rs. ${commaFormat(discountedPrice)}.00/-`;
}
