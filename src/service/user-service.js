import { request } from "express";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {getUserValidation, loginUserValidation, userUpdateValidation, registerUserValidation} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";

const register = async (request) =>{
  const user = validate(registerUserValidation, request);
  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    }
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already registered");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const result = await prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true
    }
  });

  return result;
}

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);
  const user = await prismaClient.user.findFirst({
    where: {
      username: loginRequest.username
    },
    select:{
      id: true,
      username: true,
      password: true
    }
  });

  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const passwordMatch = await bcrypt.compare(loginRequest.password, user.password);
  if (!passwordMatch) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const token = uuid().toString();
  return prismaClient.user.update({
    data: {
      token: token
    },
    where: {
      id: user.id
    },
    select: {
      token: true
    }
  });
}

const get = async (username) => {
  validate(getUserValidation, username);
  const user = await prismaClient.user.findFirst({
    where: {
      username: username
    },
    select: {
      username: true,
      name: true
    }
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return user;
}

const update = async (request) => {
  const user = validate(userUpdateValidation, request);

  const totalUser = await prismaClient.user.count({
    where: { username: user.username }
  });

  if (totalUser === 0) {
    throw new ResponseError(404, "User not found");
  }

  const data = {}
  if(user.name){
    data.name = user.name;
  }
  if(user.password){
    data.password = await bcrypt.hash(user.password, 10);
  }

  const userId = await prismaClient.user.findFirst({
    where: { username: user.username },
    select: { id: true}
  });

  return prismaClient.user.update({
    where: { id: userId.id },
    data: data,
    select: { username: true, name: true }
  });
}

const logout = async (username) => {
  validate(getUserValidation, username);
  const user = await prismaClient.user.findFirst({
    where: {username: username},
    select: {id: true}
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return prismaClient.user.update({
    where: {id: user.id},
    data: {token: null},
    select: {username: true}
  });
}

export default { register, login, get, update, logout };