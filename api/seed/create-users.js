// const JSONData = require('./data.json')
const data = require('./data.json') //JSON.parse(JSONData)
const { prisma } = require('../prisma-client')


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function main() {
  // console.log(data)
  await asyncForEach(data.users, async user => {
    const { email, username, name, phone, website, company, address } = user
    await prisma.createUser({
      email,
      username,
      name,
      phone,
      website,
      company: {
        create: {
          name: company.name,
          type: company.catchPhrase,
          bs: company.type
        }
      },
      address: {
        create: {
          ...address
        }
      },
      owned_projects: {
        create: data.projects.filter(p => p.userId === user.id).map(p => ({
          active: true,
          title: p.title,
          description: p.body
        }))
      }
    })
  })
}

main().catch(e => console.error(e))