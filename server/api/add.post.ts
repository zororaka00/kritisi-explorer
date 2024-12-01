import { PrismaClient } from "@prisma/client";
import { isAddress } from "sol-type-check";

export default defineEventHandler(async (event) => {
  try {
    var dataBody: any = await readBody(event);
    const contractAddress = dataBody.contractAddress.toLowerCase();
    if (isAddress(contractAddress)) {
      const prisma = new PrismaClient();
      const contract = await prisma.contract.findUnique({
        where: {
          contractAddress
        }
      });
      if (contract) {
        return {
          status: 400,
          message: "Contract already exists",
          data: null
        };
      } else {
        await prisma.contract.create({
          data: {
            contractAddress: contractAddress.toLowerCase()
          }
        });
        return {
          status: 200,
          message: "Success",
          data: null
        };
      }
    } else {
      return {
        status: 400,
        message: "Invalid contract address",
        data: null
      };
    }
  } catch (error) {
    return {
      status: 500,
      message: "Too many requests",
      data: null
    };
  }
});
