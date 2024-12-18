import axios from "axios";
import {colors} from '@gamastudio/colorslog';
import 'dotenv/config';

const url = "https://pydolarve.org/api/v1/dollar";
const setDolar = async (array) => {
	try
	{
		const dolar = await axios.get(url, {
			headers: {
				"token": `Bearer ${process.env.TOKEN}`,
			},
		});
		array[0] = dolar.data.monitors.bcv.price.toFixed(2);
		array[1] = dolar.data.monitors.enparalelovzla.price.toFixed(2);
		colors.success(`[DOLAR_SETTED]: BCV: ${array[0]}, ENP: ${array[1]}`);
    return array;
	} catch (error) {
		colors.error(`[DOLAR_ERROR]: ${error}`)
    return array;
	}
}

export default setDolar
