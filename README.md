# BotDolar
 Esquema base de un bot de WhatsApp capaz de enviar y hacer calculos con la tasa del dolar/bs BCV y paralelo. Hecho en Nodejs.

## Funcionamiento.
 Principalmente el codigo base viene de la libreria [codigoencasa/bot-whatsapp](https://github.com/codigoencasa/bot-whatsapp) siguiendo el esquema de "flows" o flujos conversacionales. Ciertas modificaciones se realizaron para cumplir con el objetivo del proyecto.

### Flujos.

#### * ```welcomeFlow```: Flujo bienvenida que maneja cualquier mensaje entrante diferente a las opciones default.
  ```javascript
  const welcomeFlow = addKeyword(EVENTS.WELCOME)
	.addAction(async (_,{flowDynamic,endFlow}) => {
	try {
		const message = `BCV: ${prices[0]}. Bs. \nENP: ${prices[1]}. Bs.\n\n Intente: \n1. Convertir Dolares a Bolivares \n2. Convertir Bolivares a Dolares.`
		await flowDynamic(message)
		return endFlow()
	} catch (error) {
		console.log(error)
		await flowDynamic('No se pudo realizar la consulta, intentelo mas tarde')
		return endFlow()
	}
	}, {delay: 300})
  ```
#### * ```dolarBolivarFlow```: Opcion 1. Permite convertir una cantidad de dolares en bolivares. 
  ```javascript
 const dolarBolivarFlow = addKeyword(['1'], {sensitive: true})
  .addAction(async (ctx, { gotoFlow }) => {start(ctx, gotoFlow, clock)})
  .addAnswer('Cuantos dolares?:',{capture: true},{delay: 300})
  .addAction(async (ctx,{flowDynamic,fallBack,endFlow,gotoFlow}) => {
   try{
    // test with regex
    if(!regex.test(ctx.body)) {
     reset(ctx, gotoFlow, clock)
     await flowDynamic('Por favor ingrese un valor numerico valido.')
     return fallBack()
   }
   const dolar = ctx.body
   const bolivarBCV = (dolar * prices[0]).toFixed(2)
   const bolivarENP = (dolar * prices[1]).toFixed(2)
   const message = `* BCV: ${bolivarBCV} Bs. \n* ENP: ${bolivarENP} Bs`
   await flowDynamic(message)
   stop(ctx)
   return endFlow()
  } catch (error) {
   console.log(error)
   await flowDynamic('No se pudo realizar la consulta, intentelo mas tarde')
   stop(ctx)
   return endFlow()
  }
 }, {delay: 300})
```
#### * ```bolivarDolarFlow```: Opcion 2: Permite convertir una cantidad de bolivares a dolares.
```javascript
const bolivarDolarFlow = addKeyword(['2'], {sensitive: true})
.addAction(async (ctx, { gotoFlow }) => {start(ctx, gotoFlow, clock)})
.addAnswer('Cuantos bolivares?:',{capture: true},{delay: 300})
.addAction( async (ctx,{flowDynamic,fallBack, endFlow, gotoFlow}) => {
 try{
  if(!regex.test(ctx.body)) {
  reset(ctx, gotoFlow, clock)
   await flowDynamic('Por favor ingrese un valor numerico valido.')
   return fallBack()
 }
 const bolivar = ctx.body
 const dolarBCV = (bolivar / prices[0]).toFixed(2)
 const dolarENP = (bolivar / prices[1]).toFixed(2)
 const message = `* BCV: ${dolarBCV}$. \n* ENP: ${dolarENP}$.`
 await flowDynamic(message)
 stop(ctx)
 return endFlow()
} catch (error) {
 console.log(error)
 await flowDynamic('No se pudo realizar la consulta, intentelo mas tarde')
 stop(ctx)
 return endFlow()
}
}, {delay: 300})
```

## Creditos.

* Base: [codigoencasa/bot-whatsapp](https://github.com/codigoencasa/bot-whatsapp).
* API: [fcoagz/api-pydolarvenezuela](https://github.com/fcoagz/api-pydolarvenezuela).

