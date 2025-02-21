import fs from 'fs';

function removeFile(file) {
    fs.unlinkSync("uploads/" + file, (error) => {
        if (error) console.log('unable to delete file');
        else console.log('file deleted');
    });
}

export default removeFile;