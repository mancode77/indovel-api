'use strict'

const { Module } = require('./configs/Module');
const express = require('express')
const app = express()

//init all module
const mod = new Module(app);

mod.assets();
mod.dotenv();
mod.morgan();   
mod.template();

module.exports = { app };