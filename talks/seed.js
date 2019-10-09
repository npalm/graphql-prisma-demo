const { csv } = require('csvtojson')
const { prisma } = require('./generated/prisma-client-js')

async function loadPersons(data) {
	const createPersonRequests = data.map(element => prisma.createPerson(element));
	await Promise.all(createPersonRequests);
}

async function loadConferences(data) {
	const request = data.map(element => prisma.createConference(element));
	await Promise.all(request);
}

async function findSpeakers(talk) {
	const speakers = talk.speakers.split(',')
	const fragment = `
	fragment UserIds on Person {
	  id
	}
	`
	promises = speakers.map(speaker => prisma.persons({
		where: {
			name: speaker
		}
	}).$fragment(fragment))

	const queryResult = await Promise.all(promises)
	return queryResult.reduce((result, speaker) => result.concat(speaker), [])
}


async function findConferences(talk) {
	const conferences = talk.conferences.split(',')
	const fragment = `
	fragment ConferenceIds on Conference {
	  id
	}
	`
	let result = []
	for (var i = 0; i < conferences.length; i++) {
		const data = await prisma.conferences({
			where: {
				name: conferences[i]
			}
		}).$fragment(fragment)
		result = result.concat(data)
	}

	return result
}


async function loadTalks(data) {
	const request = data.map(async talk => {
		talk.speakers = {
			connect: await findSpeakers(talk)
		}
		talk.conferences = {
			connect: await findConferences(talk)
		}

		await prisma.createTalk(talk)
	})
	await Promise.all(request);
}

async function main() {

	await loadPersons(await csv().fromFile('./talks/data/speakers.csv'))

	await loadConferences(await csv().fromFile('./talks/data/conferences.csv'))

	await loadTalks(await csv().fromFile('./talks/data/talks.csv'))
}

main().catch(e => console.error(e))