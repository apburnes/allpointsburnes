---
path: /posts/la-building-permit-data.html
title: Intro to Exploring LA's Building Permit Data
description: An introduction to exploring Los Angeles' development boom and housing crisis with building permit data.
date: "2017-10-23T00:00:00.169Z"
---

Recently, I began listening to the podcast [There Goes the Neighborhood](https://www.kcrw.com/news-culture/shows/there-goes-the-neighborhood) and its second season explores Los Angeles' development boom, affordable housing crisis, and gentrification.  One way to track and map all this development is thanks to the city's [open data portal](https://data.lacity.org/) which allows users to search, view, download, and problematically access data via [Socrata's API](https://dev.socrata.com/).  In this post, we will explore the city's building permit dataset, its schema, and accessing it from the API.

We will be working the the [Building Permits](https://data.lacity.org/A-Prosperous-City/Building-Permits/nbyu-2ha9) dataset and start exploring it through the API.  For documentation on constructing url queries refer to Socrata's [SODA API](https://dev.socrata.com/docs/endpoints.html). The base url we will be using is [https://data.lacity.org/resource/nbyu-2ha9.json](https://data.lacity.org/resource/nbyu-2ha9.json) and we will work with downloading the dataset/subsets and transform the response into geojson.  Future posts will start exploring opportunities on how to create/serve map tiles from the data, producing layers from analysis, and creating an automated update cycle.

For this example we will be using [Node.js](https://nodejs.org/en/) to dowload and filter the data so take a look at their documentation on installing node.

Use node.js to download the data
```js
var fs = require('fs');
var needle = require('needle');

var baseUrl = 'https://data.lacity.org/resource/nbyu-2ha9.json';
var query = "?$where=issue_date='2017-10-19T00:00:00'";
var outputFile = '/tmp/permits.json'

// Function to download and write data to json file
function getData(url, output callback) {
	needle.get(url, function(error, response) {
	  if (error) return callback(error);

	  var dataString = JSON.stringify(response.body, null, 2);

	  fs.writeFile(output, dataString, function(error) {
		if (error) return callback(error);

		return callback(null, 'Finished writing file to ' + output);
	  });
	});
}

// Run function to download data where issue data is October 19, 2017
var urlQuery = baseUrl + query;
getData(urlQuery, outputFile, function(error, respose) {
	if (error) return console.error(error);

	return console.log(response);
});

// Finished writing file to /tmp/permits.json
// The output file json will be an array of 1000 permits
// Default request will be 1000 records
```


This is the initial exploration of downloading permit data. Next we will continue to explore, map, and analyze the dataset for insight into Los Angeles' development. [Here's the dataset subset mapped](http://bl.ocks.org/anonymous/raw/a42fe3cf28cebf2976d4349732d8192c/) thanks to [geojson.io](http://geojson.io) and [bl.ocks.org](http://bl.ocks.org)

