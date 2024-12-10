const nameList = document.getElementById('nameList');
const addPersonForm = document.getElementById('addPersonForm');
const clearListBtn = document.getElementById("clearBtn");
const assignNames = document.getElementById("assignBtn");

const loadNames = async () => {
    const response = await fetch('/names');
    const names = await response.json();

    nameList.innerHTML = '';

    const colors = [
        '#4b77a8',
        '#457a98',
        '#3f6c88',
        '#39657a',
        '#335f6c',
        '#2e5960',
        '#285252',
        '#234b45'
    ];

    let t = names.reverse();

    t.forEach((name, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = name.Name;
        const color = colors[index % colors.length];
        listItem.style.backgroundColor = color;

        listItem.addEventListener('click', () => {
            let p = prompt("Password?");

            if (p === name.Password) {
                alert(name.To);
            } else {
                alert("Bro come on, tu t'en rappel pas?");
            }
        });

        nameList.append(listItem);
    });
};



addPersonForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const to = null;

    const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, to, password })
    });

    if (response.ok) {
        document.getElementById("name").value = "";
        document.getElementById("password").value = "";
        loadNames();
    } else {
        alert('Error adding person!');
    }
});

assignNames.addEventListener('click', async () => {
    // Send a POST request to the server
    try {
        const response = await fetch('/assignNames', {
            method: 'POST',  // Specify the request method as POST
            headers: {
                'Content-Type': 'application/json'  // Ensure the server knows we are sending JSON
            },
            body: JSON.stringify({})  // Send an empty body if no data is needed for this request
        });

        if (response.ok) {
            const assignedNames = await response.json();
            console.log('Assigned Names:', assignedNames);  // Log the result to the console
        } else {
            console.error('Failed to fetch assigned names');
        }
    } catch (error) {
        console.error('Error fetching assigned names:', error);
    }
});

clearListBtn.addEventListener("click", function () {
    const confirmation = confirm("Clear the list?");

    if (confirmation) {
        fetch('/clearList', {
            method: 'POST',
        })
            .then(response => {
                if (response.ok) {
                    const nameList = document.getElementById("nameList");
                    if (nameList) {
                        nameList.innerHTML = '';
                    }
                    document.getElementById("clearListForm").reset();
                } else {
                    alert('Error clearing the list on the server.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error clearing the list on the server.');
            });
    }
});



// Initially load names on page load
loadNames();
