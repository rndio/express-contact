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
    return prismaClient.user.findFirst({
        where: {
        username: 'testUsername'
        }
    })
}