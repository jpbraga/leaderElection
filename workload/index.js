"use strict";

const AWS = require("aws-sdk");
const DynamoDBLockClient = require("./ddb-control.js");

const logger = require("./logger").logger;

require('dotenv').config();
const dynamodb = new AWS.DynamoDB.DocumentClient(
    {
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    }
);

const failOpenClient = new DynamoDBLockClient.FailOpen(
    {
        dynamodb,
        lockTable: process.env.LOCK_TABLE_NAME,
        partitionKey: process.env.PARTITION_KEY,
        heartbeatPeriodMs: 1500,
        leaseDurationMs: 4000,
        retryCount: 0
    }
);
let leaderVar = null;
function leaderElection() {
    logger.info("Attempting to get the leader seat...");
    failOpenClient.acquireLock("my-fail-open-lock", (error, lock) => {
        if (error) {
            if (error.code === "FailedToAcquireLock") return leaderElection();
            else return logger.error("Fatal error on acquireLock execution.",error);
        }
        leaderVar = lock;
        logger.info(`acquired open lock with fencing token ${lock.fencingToken}`);
        logger.info("I'm the leader!");
        lock.on("error", error => logger.error("failed to heartbeat!", [error]));
    }
    );
}
leaderElection();

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    if (leaderVar) leaderVar.release(error => error ? console.error(JSON.stringify({level: "error", message: "Error releasing lock on exit!", originalError: error, timestamp: new Date()})) : console.log(JSON.stringify({level: "info", message: "released open lock", timestamp: new Date()})));
});