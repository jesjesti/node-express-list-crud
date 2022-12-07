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
