var path = require('path');
var fs = require('fs');

//https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs
/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.html') ==> ['./project/src/a.html','./project/src/build/index.html']
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @param  {String} filter       Extension name, e.g: '.html'
 * @return {Array}               Result files with path string in an array
 */
function findFilesInDir(startPath,filter){

    var results = [];

    if (!fs.existsSync(startPath)){
        return [];
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            results = results.concat(findFilesInDir(filename,filter)); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            results.push(filename);
        }
    }
    return results;
}

var targetDir = path.join(__dirname, '..', '@vue', 'runtime-dom', 'dist');
var searchPattern = /(e.timeStamp\s?\|\|\s?)(\w+\(\))/g;
var files = findFilesInDir(targetDir, ".prod.js");

if (files.length > 0) {
    files.forEach(file => {
        var data = fs.readFileSync(file, 'utf8');
        var result = data.replace(searchPattern, '$2');
        fs.writeFileSync(file, result, 'utf8');
    });
    console.log("Fixed cef issue");
} else
    console.log("Unable to fix cef issue");