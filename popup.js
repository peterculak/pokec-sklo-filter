document.addEventListener('DOMContentLoaded', async () => {
    
    await displayUsers();

    const clearHistoryBtn = document.getElementById('clear-history');
    clearHistoryBtn.onclick = async () => {
        await UserService.reset();
        await displayUsers();
        refreshActiveTab();
    };

    const addUserBtn = document.getElementById('add-user');
    addUserBtn.onclick = async () => saveUser();
});

const saveUser = async () => {
    await UserService.save(document.getElementById('new-user').value);
    document.getElementById('new-user').value = '';
    await displayUsers();
    refreshActiveTab();
}

const removeUser = async (username) => {
    await UserService.remove(username);
    await displayUsers();
    refreshActiveTab();
}

const refreshActiveTab = () => {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {'message': 'refresh'});
    });
}

const displayUsers = async () => {
    const users = await UserService.getUsers();
    users.sort();
    const list = document.getElementById('user-list');
    list.innerHTML = '';

    users.forEach(username => {
        const li = document.createElement('li');

        const link = document.createElement('a');
        link.title = username;
        link.innerHTML = username;
        link.href = '#';
        link.onclick = (ev) => {
            ev.preventDefault();
            removeUser(username);
            refreshActiveTab();
        };

        li.appendChild(link);
        list.appendChild(li);
    });
}
