/** @private */
const USERS_KEY = 'users';

/** Shared logic */
class UserService {

    /**
     * 
     * @returns {Promise<Array>}
     */
    static getUsers = () => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.get([USERS_KEY], (result) => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                const data = result.users ?? [];
                resolve(data);
            });
        });

        return promise;
    }

    static save = async (username) => {
        const users = await this.getUsers();
        let updatedUsers;
        if (!users.includes(username)) {
            updatedUsers = [...users, username];
        } else {
            updatedUsers = [...users];
        }

        const promise = toPromise((resolve, reject) => {
            
            chrome.storage.local.set({ [USERS_KEY]: updatedUsers }, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(updatedUsers);
            });
        });

        return promise;
    }

    static remove = async (username) => {
        const users = await this.getUsers();
        const promise = toPromise((resolve, reject) => {
            users.splice(users.indexOf(username), 1);
            chrome.storage.local.set({ [USERS_KEY]: users }, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(users);
            });
        });

        return promise;
    }

    static reset = () => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.remove([USERS_KEY], () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                resolve();
            });
        });

        return promise;
    }
}

/**
 * Promisify a callback.
 * @param {Function} callback 
 * @returns {Promise}
 */
const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}