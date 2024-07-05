const fs = require('fs');

function getImage(path) {
    try {
        const image = fs.readFileSync(path);
        return image;
    } catch (error) {
        console.error(`Error reading image: ${error}`);
        return null;
    }
}

module.exports = {
    getImage: getImage
};