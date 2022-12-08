"use strict";

exports.getCount = async (inputJson, mongoClient) => {
  return new Promise(function (resolve, reject) {
    let templateContent = require("../filter_templates/" +
      inputJson.filterCategory +
      "/" +
      inputJson.filterTemplate);

    let filterParams = inputJson.filter;

    let pipleLine = [];

    if (filterParams && filterParams.length > 0) {
      let filter = null;
      filterParams.map((filterEntry) => {
        if (filterEntry.isLikeFilter) {
          let filtervalue = {
            $regex: ".*" + filterEntry.filterValue + "*.",
            $options: "i",
          };
          pipleLine.push({
            $match: {
              [filterEntry.fieldKey]: filtervalue,
            },
          });
        } else {
          if (!filter) {
            filter = {
              $match: {
                $and: [],
              },
            };
          }
          let operator = null;
          switch (filterEntry.fieldOperator) {
            case "EQUAL":
              operator = "$eq";
              break;
            case "LESS_THAN":
              operator = "$lt";
              break;
            case "GRATER_THAN":
              operator = "$gt";
              break;
            case "NOT_EQAUL":
              operator = "$ne";
              break;
            case "LESS_THAN_EQUAL":
              operator = "$lte";
              break;
            case "GRATER_THAN_EQUAL":
              operator = "$gte";
              break;
            case "IN":
              operator = "$in";
              break;
          }
          filter.$match.$and.push({
            [filterEntry.fieldKey]: {
              [operator]: filterEntry.filterValue,
            },
          });
        }
      });
      if (filter) pipleLine.push(filter);
    }

    pipleLine.push({ $count: "count" });

    mongoClient
      .collection(templateContent.collectionName)
      .aggregate(pipleLine, {
        allowDiskUse: true,
      })
      .toArray(function (err, result) {
        err ? reject(err) : resolve(result);
      });
  });
};

exports.filterBy = async (inputJson, mongoClient) => {
  return new Promise(function (resolve, reject) {
    let templateContent = require("../filter_templates/" +
      inputJson.filterCategory +
      "/" +
      inputJson.filterTemplate);

    let filterParams = inputJson.filter;
    let selectFields = templateContent.selectFields;
    let range = inputJson.range;
    let sort = inputJson.sort;

    let pipleLine = [];

    if (filterParams && filterParams.length > 0) {
      let filter = null;
      filterParams.map((filterEntry) => {
        if (filterEntry.isLikeFilter) {
          let filtervalue = {
            $regex: ".*" + filterEntry.filterValue + "*.",
            $options: "i",
          };
          pipleLine.push({
            $match: {
              [filterEntry.fieldKey]: filtervalue,
            },
          });
        } else {
          if (!filter) {
            filter = {
              $match: {
                $and: [],
              },
            };
          }
          let operator = null;
          switch (filterEntry.fieldOperator) {
            case "EQUAL":
              operator = "$eq";
              break;
            case "LESS_THAN":
              operator = "$lt";
              break;
            case "GRATER_THAN":
              operator = "$gt";
              break;
            case "NOT_EQAUL":
              operator = "$ne";
              break;
            case "LESS_THAN_EQUAL":
              operator = "$lte";
              break;
            case "GRATER_THAN_EQUAL":
              operator = "$gte";
              break;
            case "IN":
              operator = "$in";
              break;
          }
          filter.$match.$and.push({
            [filterEntry.fieldKey]: {
              [operator]: filterEntry.filterValue,
            },
          });
        }
      });
      if (filter) pipleLine.push(filter);
    }

    if (!sort) {
      sort = { $sort: { created: -1 } };
    } else {
      sort = {
        $sort: { [sort.sortFieldName]: sort.sortType === "ASC" ? 1 : -1 },
      };
    }
    pipleLine.push(sort);

    let skip = { $skip: (range.page - 1) * range.limit };
    let limit = { $limit: range.limit };
    pipleLine.push(skip, limit);

    let projection = {};
    selectFields.forEach((element) => {
      projection[element] = 1;
    });
    pipleLine.push({ $project: projection });

    mongoClient
      .collection(templateContent.collectionName)
      .aggregate(pipleLine, {
        allowDiskUse: true,
      })
      .toArray(function (err, result) {
        err ? reject(err) : resolve(result);
      });
  });
};
