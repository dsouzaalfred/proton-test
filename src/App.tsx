import React, { useState, useEffect } from 'react';

import { Password } from './models';
import * as storage from './storage';
import { encrypt, decrypt, getKey, base64StringToUint8Array } from './crypto';
import { wait } from './helpers';
import { CRYPTO_KEY_STORAGE_KEY, PASSWORDS_STORAGE_KEY } from './constants';
import PasswordLockedContainer from './components/PasswordLockedContainer';
import PasswordMainContainer from './components/PasswordMainContainer';

function duplicateUrlsAmongPasswords(passwords: { [id: string]: Password }, url: string) {
    let duplicates: string[] = [];
    Object.keys(passwords).forEach((key) => {
        if (passwords[key].url && passwords[key].url.includes(url)) {
            duplicates.push(passwords[key].name);
        }
    });
    return duplicates.join(',');
}

function App() {
    const [loading, setLoading] = useState(true);

    const [key, setKey] = useState<CryptoKey | null>(null);

    const [decryptedPasswords, setDecryptedPasswords] = useState<{ [id: string]: Password }>({});

    const [duplicateMsg, setDuplicateMsg] = useState<string>('');

    const handleUpdateDuplicateMsg = (msg: string) => {
        setDuplicateMsg(msg);
    };

    async function hydratePasswords(newKey: CryptoKey) {
        setKey(newKey);
        await wait(500);
        const encryptedPasswords = JSON.parse(storage.getItem(PASSWORDS_STORAGE_KEY));
        if (!encryptedPasswords) {
            return;
        }
        const decryptedPasswords = JSON.parse(await decrypt(newKey, encryptedPasswords));
        setDecryptedPasswords(decryptedPasswords);
    }

    function handleSuccess(newKey: CryptoKey) {
        const run = async () => {
            try {
                await hydratePasswords(newKey);
            } catch (e) {
                return;
            }
        };

        setLoading(true);
        run().finally(() => setLoading(false));
    }

    useEffect(() => {
        const rawCryptoKey = storage.getItem<string>(CRYPTO_KEY_STORAGE_KEY);

        if (!rawCryptoKey) {
            setLoading(false);
            return;
        }

        getKey(base64StringToUint8Array(rawCryptoKey)).then((storedKey) => {
            setKey(storedKey);
            handleSuccess(storedKey);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        async function sync() {
            if (!key) {
                return;
            }
            const data = JSON.stringify(decryptedPasswords);
            const encryptedPasswords = await encrypt(key, data);
            storage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(encryptedPasswords));
        }

        sync();
    }, [decryptedPasswords]);

    function handleLogout() {
        storage.removeItem(CRYPTO_KEY_STORAGE_KEY);
        setKey(null);
    }

    function handlePasswordCreated(password: Password) {
        setDecryptedPasswords((passwords) => ({
            ...passwords,
            [password.id]: password,
        }));
    }

    function handlePasswordEdited(password: Password) {
        const nextPasswords = {
            ...decryptedPasswords,
            [password.id]: {
                ...password,
                lastModifiedAt: Date.now(),
            },
        };

        const duplicateUrls = duplicateUrlsAmongPasswords(decryptedPasswords, password.url[0]);

        if (duplicateUrls) {
            /*
             * if there are duplicate urls among the passwords alert a message such as
             * 'Duplicate url "https://foobar.com" found for passwords "foo", "bar", "baz"'
             */
            setDuplicateMsg(`Duplicate url ${password.url[0]} found for passwords ${duplicateUrls}`);
        }

        setDecryptedPasswords(nextPasswords);
    }

    function handlePasswordDeleted(id: string) {
        setDecryptedPasswords((passwords) => {
            const { [id]: deleted, ...remaining } = passwords;

            return remaining;
        });
    }

    if (loading) {
        return <>Loading</>;
    }

    if (!key) {
        return <PasswordLockedContainer onSuccess={handleSuccess} />;
    }

    return (
        <>
            <PasswordMainContainer
                decryptedPasswords={decryptedPasswords}
                onLogout={handleLogout}
                onPasswordCreated={handlePasswordCreated}
                onPasswordEdited={handlePasswordEdited}
                onPasswordDeleted={handlePasswordDeleted}
                duplicateMsg={duplicateMsg}
                updateDuplicateMsg={handleUpdateDuplicateMsg}
            />
        </>
    );
}

export default App;
