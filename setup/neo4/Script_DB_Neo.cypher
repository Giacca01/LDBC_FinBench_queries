:param {
  // Define the file path root and the individual file names required for loading.
  // https://neo4j.com/docs/operations-manual/current/configuration/file-locations/
  file_path_root: 'file:///', // Change this to the folder your script can access the files at.
  file_0: 'person.csv',
  file_1: 'company.csv',
  file_2: 'account.csv',
  file_3: 'loan.csv',
  file_4: 'medium.csv',
  file_5: 'personGuarantee.csv',
  file_6: 'personOwnAccount.csv',
  file_7: 'personInvest.csv',
  file_8: 'personApplyLoan.csv',
  file_9: 'companyGuarantee.csv',
  file_10: 'companyInvest.csv',
  file_11: 'companyApplyLoan.csv',
  file_12: 'companyOwnAccount.csv',
  file_13: 'transfer.csv',
  file_14: 'withdraw.csv',
  file_15: 'repay.csv',
  file_16: 'deposit.csv',
  file_17: 'signIn.csv'
};

// CONSTRAINT creation
// -------------------
//
// Create node uniqueness constraints, ensuring no duplicates for the given node label and ID property exist in the database. This also ensures no duplicates are introduced in future.
//
// NOTE: The following constraint creation syntax is generated based on the current connected database version 5.27.0.
CREATE CONSTRAINT `id_Person_uniq` IF NOT EXISTS
FOR (n: `Person`)
REQUIRE (n.`id`) IS UNIQUE;
CREATE CONSTRAINT `id_Company_uniq` IF NOT EXISTS
FOR (n: `Company`)
REQUIRE (n.`id`) IS UNIQUE;
CREATE CONSTRAINT `id_Account_uniq` IF NOT EXISTS
FOR (n: `Account`)
REQUIRE (n.`id`) IS UNIQUE;
CREATE CONSTRAINT `id_Loan_uniq` IF NOT EXISTS
FOR (n: `Loan`)
REQUIRE (n.`id`) IS UNIQUE;
CREATE CONSTRAINT `id_Medium_uniq` IF NOT EXISTS
FOR (n: `Medium`)
REQUIRE (n.`id`) IS UNIQUE;

:param {
  idsToSkip: []
};

// NODE load
// ---------
//
// Load nodes in batches, one node label at a time. Nodes will be created using a MERGE statement to ensure a node with the same label and ID property remains unique. Pre-existing nodes found by a MERGE statement will have their other properties set to the latest values encountered in a load file.
//
// NOTE: Any nodes with IDs in the 'idsToSkip' list parameter will not be loaded.
LOAD CSV WITH HEADERS FROM ($file_path_root + $file_0) AS row
WITH row
WHERE NOT row.`id` IN $idsToSkip AND NOT toInteger(trim(row.`id`)) IS NULL
CALL {
  WITH row
  MERGE (n: `Person` { `id`: toInteger(trim(row.`id`)) })
  SET n.`id` = toInteger(trim(row.`id`))
  SET n.`createTime` = toInteger(trim(row.`createTime`))
  SET n.`name` = row.`name`
  SET n.`isBlocked` = toLower(trim(row.`isBlocked`)) IN ['1','true','yes']
  SET n.`gender` = row.`gender`
  SET n.`birthday` = toInteger(trim(row.`birthday`))
  SET n.`country` = row.`country`
  SET n.`city` = row.`city`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_1) AS row
WITH row
WHERE NOT row.`id` IN $idsToSkip AND NOT toInteger(trim(row.`id`)) IS NULL
CALL {
  WITH row
  MERGE (n: `Company` { `id`: toInteger(trim(row.`id`)) })
  SET n.`id` = toInteger(trim(row.`id`))
  SET n.`createTime` = toInteger(trim(row.`createTime`))
  SET n.`name` = row.`name`
  SET n.`isBlocked` = toLower(trim(row.`isBlocked`)) IN ['1','true','yes']
  SET n.`country` = row.`country`
  SET n.`city` = row.`city`
  SET n.`business` = row.`business`
  SET n.`description` = row.`description`
  SET n.`url` = row.`url`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_2) AS row
WITH row
WHERE NOT row.`id` IN $idsToSkip AND NOT toInteger(trim(row.`id`)) IS NULL
CALL {
  WITH row
  MERGE (n: `Account` { `id`: toInteger(trim(row.`id`)) })
  SET n.`id` = toInteger(trim(row.`id`))
  SET n.`createTime` = toInteger(trim(row.`createTime`))
  SET n.`deleteTime` = toInteger(trim(row.`deleteTime`))
  SET n.`isBlocked` = toLower(trim(row.`isBlocked`)) IN ['1','true','yes']
  SET n.`type` = row.`type`
  SET n.`nickname` = row.`nickname`
  SET n.`phonenum` = row.`phonenum`
  SET n.`email` = row.`email`
  SET n.`freqLoginType` = row.`freqLoginType`
  SET n.`lastLoginTime` = toInteger(trim(row.`lastLoginTime`))
  SET n.`accountLevel` = row.`accountLevel`
  SET n.`inDegree` = toInteger(trim(row.`inDegree`))
  SET n.`OutDegree` = toInteger(trim(row.`OutDegree`))
  SET n.`isExplicitDeleted` = toLower(trim(row.`isExplicitDeleted`)) IN ['1','true','yes']
  SET n.`Owner` = row.`Owner`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_3) AS row
WITH row
WHERE NOT row.`id` IN $idsToSkip AND NOT toInteger(trim(row.`id`)) IS NULL
CALL {
  WITH row
  MERGE (n: `Loan` { `id`: toInteger(trim(row.`id`)) })
  SET n.`id` = toInteger(trim(row.`id`))
  SET n.`createTime` = toInteger(trim(row.`createTime`))
  SET n.`loanAmount` = toFloat(trim(row.`loanAmount`))
  SET n.`balance` = toFloat(trim(row.`balance`))
  SET n.`usage` = row.`usage`
  SET n.`interestRate` = row.`interestRate`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_4) AS row
WITH row
WHERE NOT row.`id` IN $idsToSkip AND NOT toInteger(trim(row.`id`)) IS NULL
CALL {
  WITH row
  MERGE (n: `Medium` { `id`: toInteger(trim(row.`id`)) })
  SET n.`id` = toInteger(trim(row.`id`))
  SET n.`createTime` = toInteger(trim(row.`createTime`))
  SET n.`type` = row.`type`
  SET n.`isBlocked` = toLower(trim(row.`isBlocked`)) IN ['1','true','yes']
  SET n.`lastLogin` = toInteger(trim(row.`lastLogin`))
  SET n.`riskLevel` = row.`riskLevel`
} IN TRANSACTIONS OF 10000 ROWS;


// RELATIONSHIP load
// -----------------
//
// Load relationships in batches, one relationship type at a time. Relationships are created using a MERGE statement, meaning only one relationship of a given type will ever be created between a pair of nodes.
LOAD CSV WITH HEADERS FROM ($file_path_root + $file_5) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Person` { `id`: toInteger(trim(row.`fromId`)) })
  MATCH (target: `Person` { `id`: toInteger(trim(row.`toId`)) })
  MERGE (source)-[r: `PersonGuarantee`]->(target)
  SET r.`fromId` = toInteger(trim(row.`fromId`))
  SET r.`toId` = toInteger(trim(row.`toId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`relation` = row.`relation`
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_6) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Person` { `id`: toInteger(trim(row.`personId`)) })
  MATCH (target: `Account` { `id`: toInteger(trim(row.`accountId`)) })
  MERGE (source)-[r: `PersonOwn`]->(target)
  SET r.`personId` = toInteger(trim(row.`personId`))
  SET r.`accountId` = toInteger(trim(row.`accountId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`deleteTime` = toInteger(trim(row.`deleteTime`))
  SET r.`isExplicitDeleted` = toLower(trim(row.`isExplicitDeleted`)) IN ['1','true','yes']
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_7) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Person` { `id`: toInteger(trim(row.`investorId`)) })
  MATCH (target: `Company` { `id`: toInteger(trim(row.`companyId`)) })
  MERGE (source)-[r: `PersonInvest`]->(target)
  SET r.`investorId` = toInteger(trim(row.`investorId`))
  SET r.`companyId` = toInteger(trim(row.`companyId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`ratio` = toFloat(trim(row.`ratio`))
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_8) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Person` { `id`: toInteger(trim(row.`personId`)) })
  MATCH (target: `Loan` { `id`: toInteger(trim(row.`loanId`)) })
  MERGE (source)-[r: `PersonApply`]->(target)
  SET r.`personId` = toInteger(trim(row.`personId`))
  SET r.`loanId` = toInteger(trim(row.`loanId`))
  SET r.`loanAmount` = toFloat(trim(row.`loanAmount`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`org` = row.`org`
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_9) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Company` { `id`: toInteger(trim(row.`fromId`)) })
  MATCH (target: `Company` { `id`: toInteger(trim(row.`toId`)) })
  MERGE (source)-[r: `CompanyGuarantee`]->(target)
  SET r.`fromId` = toInteger(trim(row.`fromId`))
  SET r.`toId` = toInteger(trim(row.`toId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`relation` = row.`relation`
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_10) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Company` { `id`: toInteger(trim(row.`investorId`)) })
  MATCH (target: `Company` { `id`: toInteger(trim(row.`companyId`)) })
  MERGE (source)-[r: `Invest`]->(target)
  SET r.`investorId` = toInteger(trim(row.`investorId`))
  SET r.`companyId` = toInteger(trim(row.`companyId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`ratio` = toFloat(trim(row.`ratio`))
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_11) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Company` { `id`: toInteger(trim(row.`companyId`)) })
  MATCH (target: `Loan` { `id`: toInteger(trim(row.`loanId`)) })
  MERGE (source)-[r: `CompanyApply`]->(target)
  SET r.`companyId` = toInteger(trim(row.`companyId`))
  SET r.`loanId` = toInteger(trim(row.`loanId`))
  SET r.`loanAmount` = toFloat(trim(row.`loanAmount`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`org` = row.`org`
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_12) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Company` { `id`: toInteger(trim(row.`companyId`)) })
  MATCH (target: `Account` { `id`: toInteger(trim(row.`accountId`)) })
  MERGE (source)-[r: `CompanyOwn`]->(target)
  SET r.`companyId` = toInteger(trim(row.`companyId`))
  SET r.`accountId` = toInteger(trim(row.`accountId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`deleteTime` = toInteger(trim(row.`deleteTime`))
  SET r.`isExplicitDeleted` = toLower(trim(row.`isExplicitDeleted`)) IN ['1','true','yes']
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_13) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Account` { `id`: toInteger(trim(row.`fromId`)) })
  MATCH (target: `Account` { `id`: toInteger(trim(row.`toId`)) })
  MERGE (source)-[r: `Transfer`]->(target)
  SET r.`fromId` = toInteger(trim(row.`fromId`))
  SET r.`toId` = toInteger(trim(row.`toId`))
  SET r.`multiplicityId` = toInteger(trim(row.`multiplicityId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`deleteTime` = toInteger(trim(row.`deleteTime`))
  SET r.`amount` = toFloat(trim(row.`amount`))
  SET r.`isExplicitDeleted` = toLower(trim(row.`isExplicitDeleted`)) IN ['1','true','yes']
  SET r.`orderNum` = toInteger(trim(row.`orderNum`))
  SET r.`comment` = row.`comment`
  SET r.`payType` = row.`payType`
  SET r.`goodsType` = row.`goodsType`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_14) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Account` { `id`: toInteger(trim(row.`fromId`)) })
  MATCH (target: `Account` { `id`: toInteger(trim(row.`toId`)) })
  MERGE (source)-[r: `Withdraw`]->(target)
  SET r.`fromId` = toInteger(trim(row.`fromId`))
  SET r.`toId` = toInteger(trim(row.`toId`))
  SET r.`fromType` = row.`fromType`
  SET r.`toType` = row.`toType`
  SET r.`multiplicityId` = toLower(trim(row.`multiplicityId`)) IN ['1','true','yes']
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`deleteTime` = toInteger(trim(row.`deleteTime`))
  SET r.`amount` = toFloat(trim(row.`amount`))
  SET r.`isExplicitDeleted` = toLower(trim(row.`isExplicitDeleted`)) IN ['1','true','yes']
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_15) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Account` { `id`: toInteger(trim(row.`accountId`)) })
  MATCH (target: `Loan` { `id`: toInteger(trim(row.`loanId`)) })
  MERGE (source)-[r: `Repay`]->(target)
  SET r.`accountId` = toInteger(trim(row.`accountId`))
  SET r.`loanId` = toInteger(trim(row.`loanId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`deleteTime` = toInteger(trim(row.`deleteTime`))
  SET r.`amount` = toFloat(trim(row.`amount`))
  SET r.`isExplicitDeleted` = toLower(trim(row.`isExplicitDeleted`)) IN ['1','true','yes']
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_16) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Account` { `id`: toInteger(trim(row.`loanId`)) })
  MATCH (target: `Loan` { `id`: toInteger(trim(row.`accountId`)) })
  MERGE (source)-[r: `Deposit`]->(target)
  SET r.`loanId` = toInteger(trim(row.`loanId`))
  SET r.`accountId` = toInteger(trim(row.`accountId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`deleteTime` = toInteger(trim(row.`deleteTime`))
  SET r.`amount` = toFloat(trim(row.`amount`))
  SET r.`isExplicitDeleted` = toLower(trim(row.`isExplicitDeleted`)) IN ['1','true','yes']
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_17) AS row
WITH row 
CALL {
  WITH row
  MATCH (source: `Medium` { `id`: toInteger(trim(row.`mediumId`)) })
  MATCH (target: `Account` { `id`: toInteger(trim(row.`accountId`)) })
  MERGE (source)-[r: `SignIn`]->(target)
  SET r.`mediumId` = toInteger(trim(row.`mediumId`))
  SET r.`accountId` = toInteger(trim(row.`accountId`))
  SET r.`multiplicityId` = toInteger(trim(row.`multiplicityId`))
  SET r.`createTime` = toInteger(trim(row.`createTime`))
  SET r.`deleteTime` = toInteger(trim(row.`deleteTime`))
  SET r.`isExplicitDeleted` = toLower(trim(row.`isExplicitDeleted`)) IN ['1','true','yes']
  SET r.`location` = row.`location`
  SET r.`comment` = row.`comment`
} IN TRANSACTIONS OF 10000 ROWS;
