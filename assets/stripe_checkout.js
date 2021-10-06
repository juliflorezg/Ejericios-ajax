import STRIPE_KEYS from './stripe_keys.js'

// console.log(STRIPE_KEYS)

const d = document,
   $pizzas = d.getElementById('pizzas'),
   $template = d.getElementById('pizza-template').content,
   // $pizza = $template.('pizza'),
   $fragment = d.createDocumentFragment(),
   fetchOptions = {
      headers:{
         Authorization: `Bearer ${STRIPE_KEYS.secret}`
      }
   }
   
let products, prices;

const moneyFormat = (num) => `$${num.slice(0, -2)}.${num.slice(-2)}`



//Promise.all para llamar varias peticiones fetch, en vez de ejecutar muchos fetch, se pueden condensar todos en Promise.all()
Promise.all([                                                                    
fetch('https://api.stripe.com/v1/products', fetchOptions),
fetch('https://api.stripe.com/v1/prices', fetchOptions)
])
//then() espera multiples respuestas, cuando tenga todas las respuestas (que se esperan de Promise.all()) por cada respuesta, esta se va a convertir a formato json
.then((responses) => Promise.all(responses.map(res => res.json())))              
.then(json =>{             
   console.log(json)
   products = json[0].data
   prices = json[1].data
   console.log(products, prices)
   console.log($template)
   // console.log($template.content)
   // console.log($template.content.firstElementChild)

   // console.log($pizza)

   prices.forEach(price => {
      let productData = products.filter(product => product.id === price.product)
      console.log(productData);

      $template.querySelector('.pizza').setAttribute('data-price', price.id)
      $template.querySelector('img').src = productData[0].images[0]
      $template.querySelector('img').alt = productData[0].name
      $template.querySelector('figcaption').innerHTML = `
      ${productData[0].name}
      <br>
      ${moneyFormat(price.unit_amount_decimal)} ${price.currency}`

      let $clone = d.importNode($template, true)
      $fragment.appendChild($clone)
   });

   $pizzas.appendChild($fragment)

})
.catch(err =>{
   console.log(err);
   let message = err.statusText || 'Ocurrió un error al conectarse con el API de Stripe'
   $pizzas.innerHTML = `<p>Error${err.status}: ${message}</p>`
});


d.addEventListener('click', e=>{
   if (e.target.matches('.pizza *')){
      // console.log(e.target);
      // alert('A comprar')

      let price = e.target.parentElement.getAttribute('data-price')
      // console.log(priceId)

      Stripe(STRIPE_KEYS.public)
      .redirectToCheckout({
         lineItems:[{price, quantity: 1}],
         mode:'subscription',
         successUrl: 'http://127.0.0.1:5500/assets/stripe-success.html',
         cancelUrl: 'http://127.0.0.1:5500/assets/stripe-cancel.html'
      })
      .then(res => {
         console.log(res)
         if(res.error){
            $pizzas.insertAdjacentHTML('afterend', red.error.message)
         }
      })
   }
})



// fetch('https://api.stripe.com/v1/products',{
//    headers:{
//       Authorization: `Bearer ${STRIPE_KEYS.secret}`
//    }
// })
// .then(res =>{
//    console.log(res)
//    return res.json()
// })
// .then(json =>{
//    console.log(json)
// })

// fetch('https://api.stripe.com/v1/prices',{
//    headers:{
//       Authorization: `Bearer ${STRIPE_KEYS.secret}`
//    }
// })
// .then(res =>{
//    console.log(res)
//    return res.json()
// })
// .then(json =>{
//    console.log(json)
// })