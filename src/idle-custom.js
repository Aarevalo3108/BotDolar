import { EVENTS, addKeyword } from '@builderbot/bot'
import { colors } from '@gamastudio/colorslog';
// import { BotContext, TFlow } from '@builderbot/bot/dist/types';

const timers = {};
export const clock = 30 * 1000; // 5 minutos

// Flujo para manejar la inactividad
const idleFlow = addKeyword(EVENTS.ACTION).addAction(
    async (_, { endFlow }) => {
        return endFlow("La conversación ha terminado. ¡Hasta la proxima! 👋");
    }
);

// Función para iniciar el temporizador de inactividad para un usuario
const start = (ctx, gotoFlow, ms) => {
    timers[ctx.from] = setTimeout(() => {
        colors.timeout(`[USER]: ${ctx.from}`);
        return gotoFlow(idleFlow);
    }, ms);
};

// Función para reiniciar el temporizador de inactividad para un usuario
const reset = (ctx, gotoFlow, ms) => {
    stop(ctx);
    if (timers[ctx.from]) {
        colors.info(`[RESET] [USER]: ${ctx.from}`);
        clearTimeout(timers[ctx.from]);
    }
    start(ctx, gotoFlow, ms);
};

// Función para detener el temporizador de inactividad para un usuario
const stop = (ctx) => {
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
    }
};

export {
    start,
    reset,
    stop,
    idleFlow,
};
