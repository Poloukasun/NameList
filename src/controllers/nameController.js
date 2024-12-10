const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, '../../data', 'names.json');

// Helper function to read and write data to names.json
const readData = () => {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    }
    return [];
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Controller to handle fetching names for the home page
const getNames = (req, res) => {
    const names = readData();
    res.json(names); // Send the names as JSON response
};

// Controller to handle adding a new person
const addName = (req, res) => {
    const { name, to, password } = req.body;
    const names = readData();

    // Push the new name to the list
    names.push({ Name: name, To: to, Password: password });

    // Save the updated list back to the file
    writeData(names);

    // Respond with success
    res.status(200).send();
};

module.exports = { getNames, addName };
