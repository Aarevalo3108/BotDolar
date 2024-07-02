
import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { idleFlow, reset, start, stop, clock } from './idle-custom.js'

import setDolar from './setDolar.js'


const prices = [0,0];
const PORT = process.env.PORT ?? 3008
const dolarTimer = 60 * 60 * 1000; // 60 minutes

const dolarBolivarFlow = addKeyword(['1'], {sensitive: true})
	.addAction(async (ctx, { gotoFlow }) => {start(ctx, gotoFlow, clock)})
	.addAnswer('Cuantos dolares?:',{capture: true},{delay: 300})
	.addAction(async (ctx,{flowDynamic,fallBack,endFlow,gotoFlow}) => {
		try{
			// test with regex
			if(isNaN(Number(ctx.body)) && Math.sign(Number(ctx.body)) != 1) {
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

const bolivarDolarFlow = addKeyword(['2'], {sensitive: true})
	.addAction(async (ctx, { gotoFlow }) => {start(ctx, gotoFlow, clock)})
	.addAnswer('Cuantos bolivares?:',{capture: true},{delay: 300})
	.addAction( async (ctx,{flowDynamic,fallBack, endFlow, gotoFlow}) => {
		try{
			if(isNaN(Number(ctx.body)) && Math.sign(Number(ctx.body)) != 1) {
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

const main = async () => {
    const adapterFlow = createFlow([welcomeFlow,dolarBolivarFlow,bolivarDolarFlow,idleFlow])
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    setDolar(prices)
    setInterval(() => setDolar(prices), dolarTimer)
    httpServer(+PORT)
}

main()
