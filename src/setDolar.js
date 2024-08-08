import axios from "axios";
import {colors} from '@gamastudio/colorslog';

const url = "http://pydolarve.org/api/v1/dollar";
const setDolar = async (array) => {
	try
	{
		const dolar = await axios.get(url);
		array[0] = dolar.monitors.bcv.price.toFixed(2);
		array[1] = dolar.monitors.enparalelovzla.price.toFixed(2);
		colors.success(`[DOLAR_SETTED]: BCV: ${bcv.data.price.toFixed(2)}, ENP: ${enp.data.price.toFixed(2)}`);
    return array;
	} catch (error) {
		colors.error(`[DOLAR_ERROR]: ${error}`)
    return array;
	}
}

export default setDolar
