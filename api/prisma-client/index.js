"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Address",
    embedded: false
  },
  {
    name: "Company",
    embedded: false
  },
  {
    name: "Task",
    embedded: false
  },
  {
    name: "Project",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466/pbtest/dev`
});
exports.prisma = new exports.Prisma();
