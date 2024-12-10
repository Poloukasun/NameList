const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files like scripts.js and index.html

const nameRoutes = require('./routes/nameRoutes');
app.use(nameRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.post('/clearList', (req, res) => {
    const filePath = path.join(__dirname, '..', 'data', 'names.json');

    fs.writeFile(filePath, JSON.stringify([]), (err) => {
        if (err) {
            console.error('Error clearing the JSON file:', err);
            return res.status(500).send('Error clearing the JSON file. ' + err.message);
        }
        res.status(200).send('List cleared successfully.');
    });
});

app.post('/assignNames', (req, res) => {
    const filePath = path.join(__dirname, '..', 'data', 'names.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the names file:', err);
            return res.status(500).json({ error: 'Error reading the names file.' });
        }

        let names = JSON.parse(data);
        const unassigned = names.filter(name => name.To === null);
        const assignedNames = names.filter(name => name.To !== null).map(name => name.To);

        if (unassigned.length > 1) {
            unassigned.forEach(person => {
                const availableNames = names.filter(name =>
                    !assignedNames.includes(name.Name) &&
                    name.Name !== person.Name &&
                    !unassigned.some(p => p.To === name.Name)  // Prevent reciprocal assignments
                );

                if (availableNames.length > 0) {
                    const randomRecipient = availableNames[Math.floor(Math.random() * availableNames.length)];
                    person.To = randomRecipient.Name;
                    assignedNames.push(randomRecipient.Name);
                } else {
                    console.log('No available names for assignment.');
                }
            });

            fs.writeFile(filePath, JSON.stringify(names, null, 2), (err) => {
                if (err) {
                    console.error('Error saving the names file:', err);
                    return res.status(500).json({ error: 'Error saving the names file.' });
                }
                res.status(200).json({ message: 'Names assigned successfully.' });
            });
        } else {
            res.status(400).json({ error: 'Not enough unassigned names to assign.' });
        }
    });
});

