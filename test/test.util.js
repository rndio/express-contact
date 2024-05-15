import { prismaClient } from "../src/app/database.js"
import bcrypt from 'bcrypt'

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: 'testUsername'
    }
  })
}

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: 'testUsername',
      password: await bcrypt.hash('testPassword', 10),
      name: 'testName',
      token: 'testToken'
    }
  })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
        username: 'testUsername'
        }
    })
}


export const createTestContact = async () => {
  await prismaClient.contact.create({
    data: {
      name: 'testName',
      email: 'testEmail@mail.com',
      message: 'testMessage'
    }
  })
}

export const createTestContacts = async () => {
  const contacts = [];
  for (let i = 1; i <= 15; i++) {
    contacts.push({
      name: `testName ${i}`,
      email: `testEmail${i}.mail.com`,
      message: `testMessage ${i}`
    })
  }
    await prismaClient.contact.createMany({
        data: contacts
    })
}

export const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      name: 'testName',
      email: 'testEmail@mail.com',
      message: 'testMessage'
    },
    select:{
      id: true,
      name:true,
      email:true,
      message:true
    }
  });
}

export const removeTestContact = async () => {
  await prismaClient.contact.deleteMany({
    where: {
      email: 'testEmail@mail.com'
    }
  })
}

export  const removeTestContacts = async () => {
    await prismaClient.contact.deleteMany({
        where: {
          email: { contains: 'testEmail' }
        }
    })
}
