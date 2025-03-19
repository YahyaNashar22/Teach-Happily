import fs from 'fs';

function removeFile(file) {
    fs.unlink("uploads/" + file, (error) => {
        if (error) {
            console.log(`Unable to delete file: ${file}, Error: ${error.message}`);
        } else {
            console.log(`File deleted: ${file}`);
        }
    });
}

export default removeFile;