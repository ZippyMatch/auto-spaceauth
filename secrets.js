module.exports = function(key) {
    //
    console.log("We have a key that starts with: ", key.substring(0, 10));
    console.log("We have a key that ends with: ", key.substring(key.length - 10));
}
