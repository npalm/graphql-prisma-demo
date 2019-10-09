//require('dotenv').config()
//https://github.com/prisma/prisma-examples/issues/303

const { csv } = require('csvtojson')
const { prisma } = require('./generated/prisma-client-js')

async function loadCity(data) {
	const request = data.map(element => prisma.createCity(element));
	await Promise.all(request);
}

async function findCity(bar) {
	const city = bar.city
	const fragment = `
	fragment Ids on City {
	  id
	}
	`
	const queryResult = await prisma.cities({
		where: {
			name: city
		}
	}).$fragment(fragment)

	return queryResult[0]
}



async function loadBar(data) {
	const request = data.map(async bar => {
		bar.city = {
			connect: await findCity(bar)
		}

		await prisma.createBar(bar)
	})
	await Promise.all(request);
}

async function main() {
	await loadCity(await csv().fromFile('./cities/data/cities.csv'))
	await loadBar(await csv().fromFile('./cities/data/bars.csv'))
}

main().catch(e => console.error(e))