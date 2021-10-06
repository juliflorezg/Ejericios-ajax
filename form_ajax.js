// const number = 2;

// console.log(number);  

// const word = "jejej" 

const d = document,
   w = window; 



function contactForm(){

   const $form = d.querySelector('.contact-form'),
         $inputs = d.querySelectorAll('.contact-form [required]')

   $inputs.forEach(input =>{

      const $span = d.createElement('span');

      $span.innerText = input.title;
      $span.id = input.name;
      $span.classList.add('contact-form-error', 'none')
      input.insertAdjacentElement('afterend', $span)

   })


   d.addEventListener('keyup', (e) =>{

      if(e.target.matches('.contact-form [required]')){
         const $input = e.target;         
         let pattern = $input.pattern || $input.dataset.pattern;


         if(pattern && $input.value !== ""){
            let regExp = new RegExp(pattern)
            return (!regExp.test($input.value)) 
            ? d.getElementById($input.name).classList.add('is-active')  
            : d.getElementById($input.name).classList.remove('is-active')
         }

         if(!pattern){
            return ($input.value === "")
            ? d.getElementById($input.name).classList.add('is-active')  
            : d.getElementById($input.name).classList.remove('is-active')
         }
      }
   })

   d.addEventListener('submit', (e) =>{
      e.preventDefault();
      const $loader = d.querySelector('.contact-form-loader'),
            $response = d.querySelector('.contact-form-response')

            $loader.classList.remove('none');

      fetch("https://formsubmit.co/ajax/forezjuli08@hotmail.com", {
         method: "POST",
         // headers: { 
         //     'Content-Type': 'application/json',
         //     'Accept': 'application/json'
         // },
         body: new FormData(e.target)
      })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(json =>{
         console.log(json)
            $loader.classList.add('none');
            $response.classList.remove('none')
            $response.innerHTML = `<b>${json.message}</b>`
            $form.reset()
      })
      .catch(err=>{
         console.log(err)
         let message = err.statusText || 'Ocurrio un error al enviar, intenta nuevamente'
         $response.innerHTML = `<b>Error ${err.status}: ${message}</b>`
      })
      .finally(() =>{

         setTimeout(() => {
            $response.classList.add("none")
            $response.innerHTML = ""
         }, 4000)

      })

      // setTimeout(() =>{

      //    setTimeout(() => $response.classList.add('none'), 3000)
      // }, 2000)
   })
}

d.addEventListener('DOMContentLoaded', contactForm)