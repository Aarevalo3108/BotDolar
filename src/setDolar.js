import axios from "axios";
import {colors} from '@gamastudio/colorslog';

const BCV = "https://pydolarvenezuela-api.vercel.app/api/v1/dollar/unit/bcv"
const ENP = "https://pydolarvenezuela-api.vercel.app/api/v1/dollar/unit/enparalelovzla"
const setDolar = async (array) => {
	try
	{
		const bcv = await axios.get(BCV)
		const enp = await axios.get(ENP)
		array[0] = bcv.data.price.toFixed(2);
		array[1] = enp.data.price.toFixed(2);
		colors.success(`[DOLAR_SETTED]: BCV: ${bcv.data.price.toFixed(2)}, ENP: ${enp.data.price.toFixed(2)}`)
    return array
	} catch (error) {
		colors.error(`[DOLAR_ERROR]: ${error}`)
    return array
	}
}

export default setDolar
