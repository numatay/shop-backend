import { SQSHandler } from "aws-lambda";

export const catalogBatchProcess: SQSHandler = async (event, _context) => {
  console.log("EVENT from QUEUE:", event);
};
