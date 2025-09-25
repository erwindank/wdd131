const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('ul');

button.addEventListener('click', function() {
    if (input.value.trim() === '') {
        alert('Please enter a chapter');
        input.focus();
        return;
    }
    const li = document.createElement('li');
    const deleteButton = document.createElement('button');
    li.textContent = input.value;
    deleteButton.textContent = '❌';
    li.appendChild(deleteButton);
    list.appendChild(li);
    input.value = '';
    input.focus();
    deleteButton.addEventListener('click', function() {
        list.removeChild(li);
        input.focus();
    });
});

