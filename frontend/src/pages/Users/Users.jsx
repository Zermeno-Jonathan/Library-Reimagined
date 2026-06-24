import supabase from '../../config/supabaseClient';
import { useEffect, useState } from 'react';
import styles from './Users.module.css';

function Users() {
    // // Fetching Users data from supabase
    const [fetchError, setFetchError] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase.from('users').select();

            if (error) {
                setFetchError('Could not fetch the users data');
                setUsers(null);
                console.log(error);
            }
            if (data) {
                setUsers(data);
                setFetchError(null);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="b">
            <p className={styles.b}>Users</p>

            {/* Users data output */}
            {fetchError && <p>{fetchError}</p>}
            {users && (
                <div className={styles.usersList}>
                    {users.map((user) => (
                        <p>{user.id}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Users;
