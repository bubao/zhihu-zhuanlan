var https = require("https");


// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
	https.get(url, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			callback(data);
		});
	}).on("error", function() {
		callback(null);
	});
}

exports.download = download;