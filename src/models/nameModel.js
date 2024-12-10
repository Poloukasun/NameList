const fs = require('fs');
const dataFilePath = './data/names.json';

exports.getAll = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

exports.add = (name, to, password) => {
    const names = exports.getAll();
    const newName = {
        "Name": name,
        "To": to,
        "Password": password
    };
    names.push(newName);
    fs.writeFileSync(dataFilePath, JSON.stringify(names, null, 2), 'utf8');
};
